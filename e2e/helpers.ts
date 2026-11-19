import { type Browser, expect, type Page } from "@playwright/test";

export interface Player {
  page: Page;
  errors: Error[];
  close(): Promise<void>;
}

/** A fresh, isolated browser context = a separate player with its own id. */
export async function newPlayer(browser: Browser): Promise<Player> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  return { page, errors, close: () => context.close() };
}

export function expectNoErrors(players: Player[]): void {
  for (const { errors } of players) {
    expect(errors, errors[0]?.stack).toEqual([]);
  }
}

/** Create a lobby from the main menu; returns its code (from the URL). */
export async function createLobby(page: Page): Promise<string> {
  await page.goto("/");
  await page.click("#create-custom-game-button");
  await page.waitForSelector("#custom-lobby-page");
  const match = /\/lobby\/([^/?#]+)/.exec(page.url());
  expect(match, `unexpected lobby url ${page.url()}`).not.toBeNull();
  return decodeURIComponent(match![1]);
}

/** Join a lobby by typing its code into the main menu. */
export async function joinLobby(page: Page, code: string): Promise<void> {
  await page.goto("/");
  await page.click("#join-custom-game-button");
  const input = page.locator("#custom-game-input");
  await input.waitFor();
  await input.fill(code);
  await input.press("Enter");
  await page.waitForSelector("#custom-lobby-page");
}

export async function clickReady(page: Page): Promise<void> {
  const button = page.locator("#ready-button");
  await expect(button).toBeEnabled();
  await button.click();
  await expect(button).toHaveText(/unready/i);
}
