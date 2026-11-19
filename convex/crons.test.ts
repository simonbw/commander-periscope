// @vitest-environment edge-runtime
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createGame, createLobby } from "../shared/gameFactory";
import { mockLobby } from "../shared/testMocks";
import { internal } from "./_generated/api";
import { newTest, type TestConvex } from "./test.setup";

const NOW = new Date("2026-01-01T12:00:00Z").getTime();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

async function insertLobby(
  t: TestConvex,
  code: string,
  ageMs: number,
  players: string[] = [],
) {
  const lobby = { ...createLobby(code), created: NOW - ageMs, players };
  return t.run((ctx) => ctx.db.insert("lobbies", { ...lobby, gameId: null }));
}

async function insertGame(t: TestConvex, ageMs: number) {
  const { players, usernames, teams } = mockLobby();
  const game = { ...createGame({ players, usernames, teams }), created: NOW - ageMs };
  return t.run((ctx) => ctx.db.insert("games", game));
}

async function remaining(t: TestConvex) {
  return t.run(async (ctx) => ({
    lobbies: (await ctx.db.query("lobbies").collect()).map((l) => l.code).sort(),
    games: (await ctx.db.query("games").collect()).map((g) => g._id),
  }));
}

describe("cleanupStale", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("deletes lobbies older than 6 hours, even with players", async () => {
    const t = newTest();
    await insertLobby(t, "OLDXX", 6 * HOUR + MINUTE, ["alice"]);
    await insertLobby(t, "FRESH", 5 * HOUR, ["bob"]);
    await t.mutation(internal.crons.cleanupStale, {});
    expect((await remaining(t)).lobbies).toEqual(["FRESH"]);
  });

  it("deletes empty lobbies older than 30 minutes but keeps newer empty ones", async () => {
    const t = newTest();
    await insertLobby(t, "EMPTY", 31 * MINUTE);
    await insertLobby(t, "NEWEM", 29 * MINUTE);
    await insertLobby(t, "BUSYY", 2 * HOUR, ["alice"]);
    await t.mutation(internal.crons.cleanupStale, {});
    expect((await remaining(t)).lobbies).toEqual(["BUSYY", "NEWEM"]);
  });

  it("deletes games older than 6 hours and keeps fresh ones", async () => {
    const t = newTest();
    await insertGame(t, 7 * HOUR);
    const fresh = await insertGame(t, 5 * HOUR);
    const brandNew = await insertGame(t, 0);
    await t.mutation(internal.crons.cleanupStale, {});
    expect((await remaining(t)).games.sort()).toEqual([fresh, brandNew].sort());
  });

  it("is a no-op on an empty database", async () => {
    const t = newTest();
    await t.mutation(internal.crons.cleanupStale, {});
    expect(await remaining(t)).toEqual({ lobbies: [], games: [] });
  });
});
