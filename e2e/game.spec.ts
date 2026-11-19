import { expect, type Page, test } from "@playwright/test";
import { clickReady, createLobby, expectNoErrors, joinLobby, newPlayer, type Player } from "./helpers";

type Tile = [number, number];

/** Water tiles, read from the captain's grid (GridTiles draws a dot on each). */
async function getWaterTiles(page: Page): Promise<Tile[]> {
  return page.locator("#captain-page svg circle").evaluateAll((circles) =>
    circles
      .filter((c) => c.getAttribute("r") === "0.12")
      .map((c) => [Number(c.getAttribute("cx")) - 0.5, Number(c.getAttribute("cy")) - 0.5] as [number, number]),
  );
}

/** Click the centre of a grid tile. The grid svg's viewBox is "-1 -1 16 16". */
async function clickTile(page: Page, [x, y]: Tile): Promise<void> {
  const box = await page.locator("#captain-page svg").first().boundingBox();
  if (!box) {
    throw new Error("captain grid not visible");
  }
  await page.mouse.click(box.x + ((x + 1.5) / 16) * box.width, box.y + ((y + 1.5) / 16) * box.height);
}

/** A water tile with a water neighbour, plus that neighbour. */
function pickStartAndMove(water: Tile[]): { start: Tile; next: Tile } {
  const isWater = (x: number, y: number) => water.some(([wx, wy]) => wx === x && wy === y);
  for (const [x, y] of water) {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (isWater(x + dx, y + dy)) {
        return { start: [x, y], next: [x + dx, y + dy] };
      }
    }
  }
  throw new Error("no two adjacent water tiles");
}

test.describe("full game", () => {
  let players: Player[] = [];

  test.beforeEach(async ({ browser }) => {
    players = await Promise.all(Array.from({ length: 8 }, () => newPlayer(browser)));
  });

  test.afterEach(async () => {
    await Promise.all(players.map((p) => p.close()));
  });

  test("8 players create a lobby, pick roles, ready up, and play a turn", async () => {
    const pages = players.map((p) => p.page);
    const [redCaptain, redFirstMate, redEngineer, redRadio] = pages.slice(0, 4);
    const [blueCaptain, blueFirstMate, blueEngineer, blueRadio] = pages.slice(4, 8);

    // --- Lobby -------------------------------------------------------------
    const code = await createLobby(redCaptain);
    await expect(redCaptain).toHaveTitle("Commander Periscope");
    await Promise.all(pages.slice(1).map((page) => joinLobby(page, code)));
    expectNoErrors(players);

    const seats: [Page, string][] = [
      [redCaptain, "#red-captain"],
      [redFirstMate, "#red-first_mate"],
      [redEngineer, "#red-engineer"],
      [redRadio, "#red-radio_operator"],
      [blueCaptain, "#blue-captain"],
      [blueFirstMate, "#blue-first_mate"],
      [blueEngineer, "#blue-engineer"],
      [blueRadio, "#blue-radio_operator"],
    ];
    // All at once: Convex serializes the concurrent selectRole mutations.
    await Promise.all(seats.map(([page, selector]) => page.click(selector)));
    await Promise.all(pages.map((page) => expect(page.locator("#ready-button")).toBeEnabled()));

    // Readying concurrently works now (the old socket server needed these
    // serialized — "TODO: Why do these have to be synchronous?").
    await Promise.all(pages.slice(0, 7).map(clickReady));
    await pages[7].click("#ready-button"); // the 8th ready starts the game
    expectNoErrors(players);

    // --- Game pages --------------------------------------------------------
    await Promise.all([
      expect(redCaptain.locator("#captain-page")).toBeVisible(),
      expect(redFirstMate.locator("#first-mate-page")).toBeVisible(),
      expect(redEngineer.locator("#engineer-page")).toBeVisible(),
      expect(redRadio.locator("#radio-operator-page")).toBeVisible(),
      expect(blueCaptain.locator("#captain-page")).toBeVisible(),
      expect(blueFirstMate.locator("#first-mate-page")).toBeVisible(),
      expect(blueEngineer.locator("#engineer-page")).toBeVisible(),
      expect(blueRadio.locator("#radio-operator-page")).toBeVisible(),
    ]);
    expect(new URL(redCaptain.url()).pathname).toBe(`/lobby/${code}`);

    // --- Pick start locations ---------------------------------------------
    const water = await getWaterTiles(redCaptain);
    expect(water.length).toBeGreaterThan(100);
    const { start, next } = pickStartAndMove(water);
    await clickTile(redCaptain, start);
    await clickTile(blueCaptain, start);

    // --- Red captain moves; first mate charges; engineer breaks down --------
    // Engineer subsystems only enable once a move is pending, so this also
    // proves the game reached the main phase.
    const engineerButtons = redEngineer.locator("#engineer-page button:not([disabled])");
    await expect(engineerButtons).toHaveCount(0);
    await clickTile(redCaptain, next);

    // The enemy radio operator hears the move.
    await expect(blueRadio.locator("#radio-operator-page li").first()).toBeVisible();

    const chargeButtons = redFirstMate.locator("#first-mate-page button:not([disabled])");
    await expect(chargeButtons.first()).toBeVisible();
    await chargeButtons.first().click();
    await expect(chargeButtons).toHaveCount(0); // charged; waiting for next turn

    await expect(engineerButtons.first()).toBeVisible();
    await engineerButtons.first().click();
    await expect(engineerButtons).toHaveCount(0);

    expectNoErrors(players);
  });
});
