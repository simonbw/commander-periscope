/// <reference types="vite/client" />
// Shared helpers for the convex-test backend suites (convex/*.test.ts).
// Convex's bundler skips files whose names contain multiple dots, so neither
// this file nor the tests are deployed.

import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import schema from "./schema";

/** Every Convex module except tests/setup (files with more than one dot). */
export const modules = Object.fromEntries(
  Object.entries(import.meta.glob("./**/*.*s")).filter(
    ([path]) => path.split("/").pop()!.split(".").length <= 2,
  ),
);

export function newTest() {
  return convexTest(schema, modules);
}

export type TestConvex = ReturnType<typeof newTest>;

export type Team = "red" | "blue";
export type Role = "captain" | "first_mate" | "radio_operator" | "engineer";

/** Seat assignments for a full 8-player game, keyed by player id. */
export const SEATS: { playerId: string; team: Team; role: Role }[] = [
  { playerId: "red-captain", team: "red", role: "captain" },
  { playerId: "red-first-mate", team: "red", role: "first_mate" },
  { playerId: "red-radio", team: "red", role: "radio_operator" },
  { playerId: "red-engineer", team: "red", role: "engineer" },
  { playerId: "blue-captain", team: "blue", role: "captain" },
  { playerId: "blue-first-mate", team: "blue", role: "first_mate" },
  { playerId: "blue-radio", team: "blue", role: "radio_operator" },
  { playerId: "blue-engineer", team: "blue", role: "engineer" },
];

export function seat(team: Team, role: Role): string {
  return SEATS.find((s) => s.team === team && s.role === role)!.playerId;
}

/** Fill all 8 seats but leave the final player unreadied. */
export async function fillLobby(t: TestConvex): Promise<string> {
  const [first, ...rest] = SEATS;
  const code = await t.mutation(api.lobbies.createLobby, {
    playerId: first.playerId,
    username: first.playerId,
  });
  for (const s of rest) {
    await t.mutation(api.lobbies.joinLobby, {
      playerId: s.playerId,
      code,
      username: s.playerId,
    });
  }
  for (const s of SEATS) {
    await t.mutation(api.lobbies.selectRole, {
      playerId: s.playerId,
      code,
      team: s.team,
      role: s.role,
    });
  }
  return code;
}

/** Create a lobby, seat and ready all 8 players, and return the new game. */
export async function startGame(
  t: TestConvex,
): Promise<{ code: string; gameId: Id<"games"> }> {
  const code = await fillLobby(t);
  for (const s of SEATS) {
    await t.mutation(api.lobbies.readyUp, { playerId: s.playerId, code });
  }
  const lobby = await t.query(api.lobbies.getLobby, {
    playerId: SEATS[0].playerId,
    code,
  });
  if (!lobby?.gameId) {
    throw new Error("Expected the lobby to have started a game");
  }
  return { code, gameId: lobby.gameId as Id<"games"> };
}

/** The player's role-filtered view, failing loudly if they are not seated. */
export async function viewFor(
  t: TestConvex,
  gameId: Id<"games">,
  playerId: string,
) {
  const result = await t.query(api.games.getGame, { playerId, gameId });
  if (!result || result.notInGame) {
    throw new Error(`Expected ${playerId} to be seated in ${gameId}`);
  }
  return result.view;
}
