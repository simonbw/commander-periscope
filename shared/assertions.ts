// Assertions that verify a game is in a state where an action is allowed.
// Each throws a GameStateError (HTTP 400) on failure.

import { GameStateError } from "./errors";
import { canUseSystem } from "./gameUtils";
import { MAIN_PHASE } from "./gamePhase";
import { includesLocation, WATER_TILE } from "./grid";
import type { Game, Grid, Location, SystemName, Team } from "./types";

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new GameStateError(message);
  }
}

export function assertNotStarted(game: Game): void {
  assert(game.phase < MAIN_PHASE, `Expected not started. Phase is ${game.phase}`);
}

export function assertMainPhase(game: Game): void {
  assert(game.phase === MAIN_PHASE, `Expected MAIN_PHASE, got ${game.phase}`);
}

export function assertValidStartLocation(location: Location, grid: Grid): void {
  assert(grid[location[0]]?.[location[1]] === WATER_TILE, "Must start on water tile");
}

export function assertCanMove(game: Game, team: Team): void {
  assertMainPhase(game);
  const turnInfo = game.teamState[team].turnInfo;
  assert(!turnInfo.waitingForFirstMate, "Cannot move. Waiting for First Mate");
  assert(!turnInfo.waitingForEngineer, "Cannot move. Waiting for Engineer");
}

export function assertCanMoveTo(
  location: Location,
  grid: Grid,
  subPath: Location[],
  mineLocations: Location[],
): void {
  const [x, y] = location;
  assert(
    x >= 0 && y >= 0 && x <= grid.length && y <= grid[0].length,
    "Cannot move out of bounds",
  );
  assert(!includesLocation(subPath, location), "Cannot cross your path.");
  assert(!includesLocation(mineLocations, location), "Cannot move across your mines");
  assert(grid[x]?.[y] === WATER_TILE, `Can only move into water tiles. ${grid[x]?.[y]}`);
}

export function assertSystemReady(
  game: Game,
  team: Team,
  systemName: SystemName,
): void {
  assertMainPhase(game);
  if (!canUseSystem(game, team, systemName)) {
    const system = game.teamState[team].systems[systemName];
    assert(system.charge === system.maxCharge, "System must be charged");
    // Charged but not usable means it is broken.
    throw new GameStateError("System is broken");
  }
}
