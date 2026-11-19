// @vitest-environment edge-runtime
import { ConvexError } from "convex/values";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SURFACE_DURATION } from "../shared/constants";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { newTest, seat, SEATS, startGame, type TestConvex, viewFor } from "./test.setup";

const RED_CAPTAIN = seat("red", "captain");
const RED_FIRST_MATE = seat("red", "first_mate");
const RED_RADIO = seat("red", "radio_operator");
const RED_ENGINEER = seat("red", "engineer");
const BLUE_CAPTAIN = seat("blue", "captain");
const BLUE_FIRST_MATE = seat("blue", "first_mate");
const BLUE_RADIO = seat("blue", "radio_operator");
const BLUE_ENGINEER = seat("blue", "engineer");

// Water tiles on the default (Bravo) grid; asserted against the live grid below.
const RED_START: [number, number] = [0, 0];
const BLUE_START: [number, number] = [14, 14];

// Standard engineer panel indexes (shared/subsystems.ts) for EAST moves that
// do not affect weapons: 18 = comms (circuit 2), 19 = special (circuit 3),
// 21 = nuclear.
const EAST_NON_WEAPONS_BREAKDOWNS = [18, 19, 21];

async function getDoc(t: TestConvex, gameId: Id<"games">) {
  const doc = await t.run((ctx) => ctx.db.get(gameId));
  return doc!;
}

/** A started game with both start locations set (MAIN_PHASE). */
async function mainPhaseGame() {
  const t = newTest();
  const { gameId } = await startGame(t);
  const grid = (await viewFor(t, gameId, RED_CAPTAIN)).grid!;
  expect(grid[RED_START[0]][RED_START[1]]).toBe(0);
  expect(grid[BLUE_START[0]][BLUE_START[1]]).toBe(0);
  await t.mutation(api.games.setStartLocation, {
    playerId: RED_CAPTAIN,
    gameId,
    location: RED_START,
  });
  await t.mutation(api.games.setStartLocation, {
    playerId: BLUE_CAPTAIN,
    gameId,
    location: BLUE_START,
  });
  return { t, gameId };
}

/** One full red turn: move EAST, charge `system`, track `breakdown`. */
async function redTurnEast(
  t: TestConvex,
  gameId: Id<"games">,
  system: "mine" | "torpedo" | "drone" | "sonar" | "silent",
  breakdownIndex: number,
) {
  await t.mutation(api.games.headInDirection, {
    playerId: RED_CAPTAIN,
    gameId,
    direction: "EAST",
  });
  await t.mutation(api.games.chargeSystem, {
    playerId: RED_FIRST_MATE,
    gameId,
    systemName: system,
  });
  await t.mutation(api.games.trackBreakdown, {
    playerId: RED_ENGINEER,
    gameId,
    breakdownIndex,
  });
}

describe("getGame", () => {
  it("returns null for a missing game", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    await t.run((ctx) => ctx.db.delete(gameId));
    expect(await t.query(api.games.getGame, { playerId: RED_CAPTAIN, gameId })).toBeNull();
  });

  it("returns notInGame for an unseated player", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    expect(
      await t.query(api.games.getGame, { playerId: "spectator", gameId }),
    ).toEqual({ notInGame: true });
  });

  it("returns each seated player's team and role", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    for (const s of SEATS) {
      const result = await t.query(api.games.getGame, { playerId: s.playerId, gameId });
      expect(result).toMatchObject({
        notInGame: false,
        view: { team: s.team, role: s.role, phase: 1, hitPoints: 4, surfaced: false },
      });
    }
  });

  it("filters the view by role", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);

    const captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.grid).toHaveLength(15);
    expect(captain.subLocation).toBeNull();
    expect(captain.subPath).toEqual([]);
    expect(captain.turnInfo).toBeDefined();
    expect(captain.systemStatuses).toBeDefined();
    expect(captain).not.toHaveProperty("systems");
    expect(captain).not.toHaveProperty("subsystems");
    expect(captain).not.toHaveProperty("notifications");

    const firstMate = await viewFor(t, gameId, RED_FIRST_MATE);
    expect(firstMate.systems).toMatchObject({ torpedo: { charge: 0, maxCharge: 3 } });
    expect(firstMate).not.toHaveProperty("grid");
    expect(firstMate).not.toHaveProperty("subLocation");

    const engineer = await viewFor(t, gameId, RED_ENGINEER);
    expect(engineer.subsystems).toHaveLength(24);
    expect(engineer.breakdowns).toEqual([]);
    expect(engineer.lastDirectionMoved).toBeNull();
    expect(engineer).not.toHaveProperty("grid");
    expect(engineer).not.toHaveProperty("subLocation");

    const radio = await viewFor(t, gameId, RED_RADIO);
    expect(radio.grid).toHaveLength(15);
    expect(radio.notifications).toEqual([]);
    expect(radio).not.toHaveProperty("subLocation");
    expect(radio).not.toHaveProperty("subPath");
    expect(radio).not.toHaveProperty("mineLocations");
  });

  it("never exposes the opponent's sub location", async () => {
    const { t, gameId } = await mainPhaseGame();
    for (const s of SEATS) {
      const view = await viewFor(t, gameId, s.playerId);
      const json = JSON.stringify(view);
      const opponentStart = s.team === "red" ? BLUE_START : RED_START;
      if (view.subLocation !== undefined) {
        expect(view.subLocation).not.toEqual(opponentStart);
      }
      expect(json).not.toContain("teamState");
    }
  });
});

describe("role authorization", () => {
  it("only the captain can steer and fire", async () => {
    const { t, gameId } = await mainPhaseGame();
    for (const playerId of [RED_FIRST_MATE, RED_RADIO, RED_ENGINEER, "spectator"]) {
      await expect(
        t.mutation(api.games.headInDirection, { playerId, gameId, direction: "EAST" }),
      ).rejects.toBeInstanceOf(ConvexError);
      await expect(
        t.mutation(api.games.fireTorpedo, { playerId, gameId, target: [1, 1] }),
      ).rejects.toThrow(/not the captain/);
      await expect(
        t.mutation(api.games.surface, { playerId, gameId }),
      ).rejects.toThrow(/not the captain/);
    }
  });

  it("only the captain can set the start location", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    await expect(
      t.mutation(api.games.setStartLocation, {
        playerId: RED_FIRST_MATE,
        gameId,
        location: RED_START,
      }),
    ).rejects.toThrow(/not the captain/);
  });

  it("only the first mate can charge systems", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.headInDirection, {
      playerId: RED_CAPTAIN,
      gameId,
      direction: "EAST",
    });
    for (const playerId of [RED_CAPTAIN, RED_RADIO, RED_ENGINEER]) {
      await expect(
        t.mutation(api.games.chargeSystem, { playerId, gameId, systemName: "torpedo" }),
      ).rejects.toThrow(/not the first_mate/);
    }
  });

  it("only the engineer can track breakdowns", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.headInDirection, {
      playerId: RED_CAPTAIN,
      gameId,
      direction: "EAST",
    });
    for (const playerId of [RED_CAPTAIN, RED_FIRST_MATE, RED_RADIO]) {
      await expect(
        t.mutation(api.games.trackBreakdown, { playerId, gameId, breakdownIndex: 18 }),
      ).rejects.toThrow(/not the engineer/);
    }
  });

  it("a player acts only for their own team", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.headInDirection, {
      playerId: BLUE_CAPTAIN,
      gameId,
      direction: "NORTH",
    });
    const before = await getDoc(t, gameId);
    expect(before.teamState.red.subLocation).toEqual(RED_START);
    expect(before.teamState.blue.subLocation).toEqual([14, 13]);
  });

  it("throws a ConvexError for a missing game", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    await t.run((ctx) => ctx.db.delete(gameId));
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "EAST",
      }),
    ).rejects.toThrow(/Game not found/);
  });
});

describe("game play", () => {
  it("setStartLocation rejects land and moves to MAIN_PHASE once both are set", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    // [2, 1] is land on the Bravo grid.
    await expect(
      t.mutation(api.games.setStartLocation, {
        playerId: RED_CAPTAIN,
        gameId,
        location: [2, 1],
      }),
    ).rejects.toThrow(/water/);

    await t.mutation(api.games.setStartLocation, {
      playerId: RED_CAPTAIN,
      gameId,
      location: RED_START,
    });
    let red = await viewFor(t, gameId, RED_CAPTAIN);
    expect(red.subLocation).toEqual(RED_START);
    expect(red.phase).toBe(1);

    await t.mutation(api.games.setStartLocation, {
      playerId: BLUE_CAPTAIN,
      gameId,
      location: BLUE_START,
    });
    red = await viewFor(t, gameId, RED_CAPTAIN);
    expect(red.phase).toBe(2);
    expect((await viewFor(t, gameId, BLUE_CAPTAIN)).subLocation).toEqual(BLUE_START);

    // Start locations are locked once the game is under way.
    await expect(
      t.mutation(api.games.setStartLocation, {
        playerId: RED_CAPTAIN,
        gameId,
        location: [1, 0],
      }),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("cannot move before the game starts", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "EAST",
      }),
    ).rejects.toThrow(/MAIN_PHASE/);
  });

  it("plays a move -> charge -> breakdown turn", async () => {
    const { t, gameId } = await mainPhaseGame();

    await t.mutation(api.games.headInDirection, {
      playerId: RED_CAPTAIN,
      gameId,
      direction: "EAST",
    });
    let captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.subLocation).toEqual([1, 0]);
    expect(captain.subPath).toEqual([RED_START]);
    expect(captain.turnInfo).toMatchObject({
      turnNumber: 1,
      waitingForFirstMate: true,
      waitingForEngineer: true,
    });

    // Can't move again until the crew has acted.
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "EAST",
      }),
    ).rejects.toThrow(/Waiting for First Mate/);

    // Radio operators on both teams hear the move.
    const blueRadio = await viewFor(t, gameId, BLUE_RADIO);
    expect(blueRadio.notifications).toEqual([
      expect.objectContaining({ kind: "MOVE", team: "red", direction: "EAST" }),
    ]);

    expect((await viewFor(t, gameId, RED_FIRST_MATE)).waitingForFirstMate).toBe(true);
    await t.mutation(api.games.chargeSystem, {
      playerId: RED_FIRST_MATE,
      gameId,
      systemName: "torpedo",
    });
    const firstMate = await viewFor(t, gameId, RED_FIRST_MATE);
    expect(firstMate.systems!.torpedo.charge).toBe(1);
    expect(firstMate.waitingForFirstMate).toBe(false);
    await expect(
      t.mutation(api.games.chargeSystem, {
        playerId: RED_FIRST_MATE,
        gameId,
        systemName: "torpedo",
      }),
    ).rejects.toThrow(/already gone/);
    // Blue's systems are untouched.
    expect((await viewFor(t, gameId, BLUE_FIRST_MATE)).systems!.torpedo.charge).toBe(0);

    let engineer = await viewFor(t, gameId, RED_ENGINEER);
    expect(engineer.lastDirectionMoved).toBe("EAST");
    expect(engineer.waitingForEngineer).toBe(true);
    // Index 0 is a WEST subsystem: breakdowns must match the move direction.
    await expect(
      t.mutation(api.games.trackBreakdown, {
        playerId: RED_ENGINEER,
        gameId,
        breakdownIndex: 0,
      }),
    ).rejects.toThrow(/direction moved/);
    await t.mutation(api.games.trackBreakdown, {
      playerId: RED_ENGINEER,
      gameId,
      breakdownIndex: 18,
    });
    engineer = await viewFor(t, gameId, RED_ENGINEER);
    expect(engineer.breakdowns).toEqual([18]);
    expect(engineer.waitingForEngineer).toBe(false);
    expect((await viewFor(t, gameId, BLUE_ENGINEER)).breakdowns).toEqual([]);

    // Turn complete: the captain may move again.
    captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.turnInfo).toMatchObject({
      waitingForFirstMate: false,
      waitingForEngineer: false,
    });
    await t.mutation(api.games.headInDirection, {
      playerId: RED_CAPTAIN,
      gameId,
      direction: "EAST",
    });
    expect((await viewFor(t, gameId, RED_CAPTAIN)).subLocation).toEqual([2, 0]);
  });

  it("rejects moving off the grid or back across the path", async () => {
    const { t, gameId } = await mainPhaseGame();
    // [0, 0] is the NW corner.
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "NORTH",
      }),
    ).rejects.toBeInstanceOf(ConvexError);

    await redTurnEast(t, gameId, "torpedo", 18);
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "WEST",
      }),
    ).rejects.toThrow(/cross your path/);
  });

  it("drops a mine, hiding its location from the enemy radio operator", async () => {
    const { t, gameId } = await mainPhaseGame();
    for (const breakdown of EAST_NON_WEAPONS_BREAKDOWNS) {
      await redTurnEast(t, gameId, "mine", breakdown);
    }
    let captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.subLocation).toEqual([3, 0]);
    expect(captain.systemStatuses!.mine).toBe(true);

    await t.mutation(api.games.dropMine, {
      playerId: RED_CAPTAIN,
      gameId,
      location: [3, 1],
    });
    captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.mineLocations).toEqual([[3, 1]]);
    expect(captain.systemStatuses!.mine).toBe(false);
    expect(captain.turnInfo!.usedSystem).toBe(true);
    expect((await viewFor(t, gameId, RED_FIRST_MATE)).systems!.mine.charge).toBe(0);

    const blueRadio = await viewFor(t, gameId, BLUE_RADIO);
    const enemyMine = blueRadio.notifications!.find((n) => n.kind === "DROP_MINE");
    expect(enemyMine).toBeDefined();
    expect(enemyMine).toMatchObject({ team: "red" });
    expect((enemyMine as { location?: unknown }).location).toBeUndefined();
    // Blue's captain doesn't learn the mine location either.
    expect((await viewFor(t, gameId, BLUE_CAPTAIN)).mineLocations).toEqual([]);

    // The red radio operator only tracks the enemy, not their own mines.
    const redRadio = await viewFor(t, gameId, RED_RADIO);
    expect(redRadio.notifications!.some((n) => n.kind === "DROP_MINE")).toBe(false);
  });

  it("refuses to fire an uncharged torpedo", async () => {
    const { t, gameId } = await mainPhaseGame();
    await expect(
      t.mutation(api.games.fireTorpedo, {
        playerId: RED_CAPTAIN,
        gameId,
        target: [1, 1],
      }),
    ).rejects.toThrow(/must be charged/);
  });
});

describe("surface", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("surfaces the team and schedules endSurface", async () => {
    const { t, gameId } = await mainPhaseGame();
    await redTurnEast(t, gameId, "torpedo", 18);

    await t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId });

    let captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.surfaced).toBe(true);
    expect((await viewFor(t, gameId, RED_ENGINEER)).surfaced).toBe(true);
    expect((await viewFor(t, gameId, BLUE_CAPTAIN)).surfaced).toBe(false);
    // The enemy hears which sector red surfaced in ([1, 0] is sector 0).
    const blueRadio = await viewFor(t, gameId, BLUE_RADIO);
    expect(blueRadio.notifications![0]).toMatchObject({
      kind: "SURFACE",
      team: "red",
      sector: 0,
    });

    const scheduled = await t.run((ctx) => ctx.db.system.query("_scheduled_functions").collect());
    expect(scheduled).toHaveLength(1);
    expect(scheduled[0]).toMatchObject({
      name: "games:endSurface",
      args: [{ gameId, team: "red" }],
      state: { kind: "pending" },
    });
    expect(scheduled[0].scheduledTime - Date.now()).toBeGreaterThan(SURFACE_DURATION - 1000);

    // Still surfaced just before the timer fires.
    vi.advanceTimersByTime(SURFACE_DURATION - 1000);
    expect((await viewFor(t, gameId, RED_CAPTAIN)).surfaced).toBe(true);

    await t.finishAllScheduledFunctions(vi.runAllTimers);

    captain = await viewFor(t, gameId, RED_CAPTAIN);
    expect(captain.surfaced).toBe(false);
    // Surfacing clears the path and breakdowns.
    expect(captain.subPath).toEqual([]);
    expect(captain.subLocation).toEqual([1, 0]);
    expect((await viewFor(t, gameId, RED_ENGINEER)).breakdowns).toEqual([]);
  });

  // BUG (shared/gameLogic.ts surfaceStart, ~line 263): surfaceStart performs no
  // assertions, so a captain can surface before the game starts (PICK_PHASE,
  // with no sub location — the notification falls back to sector 0).
  it.fails("rejects surfacing before the game has started", async () => {
    const t = newTest();
    const { gameId } = await startGame(t);
    await expect(
      t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId }),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  // BUG (shared/gameLogic.ts surfaceStart): surfacing while already surfaced
  // is allowed and schedules a second endSurface, so overlapping surfaces end
  // at the first timer and each one broadcasts another SURFACE notification.
  it.fails("rejects surfacing while already surfaced", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId });
    await expect(
      t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId }),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  // BUG (shared/assertions.ts assertCanMove, ~line 28): there is no surfaced
  // check, so a surfaced sub can keep moving (and the move is later wiped
  // from subPath by surfaceEnd).
  it.fails("rejects moving while surfaced", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId });
    await expect(
      t.mutation(api.games.headInDirection, {
        playerId: RED_CAPTAIN,
        gameId,
        direction: "EAST",
      }),
    ).rejects.toBeInstanceOf(ConvexError);
  });

  it("endSurface is a no-op if the game was deleted", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId });
    await t.run((ctx) => ctx.db.delete(gameId));
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const scheduled = await t.run((ctx) => ctx.db.system.query("_scheduled_functions").collect());
    expect(scheduled[0].state.kind).toBe("success");
  });

  it("endSurface can be run directly as an internal mutation", async () => {
    const { t, gameId } = await mainPhaseGame();
    await t.mutation(api.games.surface, { playerId: RED_CAPTAIN, gameId });
    await t.mutation(internal.games.endSurface, { gameId, team: "red" });
    expect((await viewFor(t, gameId, RED_CAPTAIN)).surfaced).toBe(false);
  });
});
