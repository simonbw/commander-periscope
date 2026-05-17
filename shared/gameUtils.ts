import { ALL_DIRECTIONS } from "./direction";
import {
  fillFromTile,
  getGridSize,
  getLocationFromDirection,
  includesLocation,
  isInGrid,
  tileToSector,
  WATER_TILE,
} from "./grid";
import { CIRCUITS, getSystemType, NUCLEAR } from "./system";
import { BOTH_TEAMS } from "./team";
import type {
  Direction,
  Game,
  Grid,
  Location,
  Role,
  SonarResult,
  Subsystem,
  SystemName,
  Team,
  TeamAndRole,
  TeamRoster,
} from "./types";

/** Find which team and role a player occupies, or undefined if unseated. */
export function getTeamAndRole(
  teams: Record<Team, TeamRoster> | undefined,
  playerId: string | undefined,
): TeamAndRole | undefined {
  if (!teams || !playerId) {
    return undefined;
  }
  for (const team of BOTH_TEAMS) {
    const roster = teams[team];
    for (const role of Object.keys(roster) as Role[]) {
      if (roster[role] === playerId) {
        return { team, role };
      }
    }
  }
  return undefined;
}

export function isValidStartLocation(
  location: Location | null,
  grid: Grid,
): boolean {
  if (!location) {
    return false;
  }
  return grid[location[0]]?.[location[1]] === WATER_TILE;
}

/** A system is usable when fully charged and not affected by a breakdown. */
export function canUseSystem(
  game: Game,
  team: Team,
  systemName: SystemName,
): boolean {
  const system = game.teamState[team].systems[systemName];
  if (system.charge < system.maxCharge) {
    return false;
  }
  const systemType = getSystemType(systemName);
  for (const breakdownIndex of game.teamState[team].breakdowns) {
    if (game.subsystems[breakdownIndex]?.systemType === systemType) {
      return false;
    }
  }
  return true;
}

/** Remove breakdowns belonging to any circuit that is now fully broken. */
export function fixCircuits(
  subsystems: Subsystem[],
  breakdowns: number[],
): number[] {
  let result = breakdowns;
  for (const circuit of CIRCUITS) {
    const circuitIndexes = subsystems
      .map((_, i) => i)
      .filter((i) => subsystems[i].circuit === circuit);
    if (
      circuitIndexes.length > 0 &&
      circuitIndexes.every((i) => result.includes(i))
    ) {
      result = result.filter((i) => !circuitIndexes.includes(i));
    }
  }
  return result;
}

/** True when the reactor overloads: a whole direction, or all nuclear, broken. */
export function checkEngineOverload(
  subsystems: Subsystem[],
  breakdowns: number[],
): boolean {
  const broken = new Set(breakdowns);

  const byDirection = new Map<Direction, number[]>();
  subsystems.forEach((s, i) => {
    const list = byDirection.get(s.direction) ?? [];
    list.push(i);
    byDirection.set(s.direction, list);
  });
  for (const indexes of byDirection.values()) {
    if (indexes.every((i) => broken.has(i))) {
      return true;
    }
  }

  const nuclearIndexes = subsystems
    .map((_, i) => i)
    .filter((i) => subsystems[i].systemType === NUCLEAR);
  return nuclearIndexes.length > 0 && nuclearIndexes.every((i) => broken.has(i));
}

export function getLastDirectionMoved(
  notifications: Game["notifications"],
  team: Team,
): Direction | null {
  for (let i = notifications.length - 1; i >= 0; i--) {
    const n = notifications[i];
    if (n.team === team && n.kind === "MOVE") {
      return n.direction;
    }
  }
  return null;
}

export function isValidMoveTile(
  location: Location,
  grid: Grid,
  path: Location[],
  mines: Location[],
): boolean {
  return (
    isInGrid(location, getGridSize(grid)) &&
    !includesLocation(path, location) &&
    !includesLocation(mines, location) &&
    grid[location[0]]?.[location[1]] === WATER_TILE
  );
}

export function getMoveOptions(
  subLocation: Location,
  grid: Grid,
  path: Location[],
  mines: Location[],
): Location[] {
  return ALL_DIRECTIONS.map((direction) =>
    getLocationFromDirection(subLocation, direction),
  ).filter((location) => isValidMoveTile(location, grid, path, mines));
}

export function getSilentOptions(
  subLocation: Location,
  grid: Grid,
  path: Location[],
  mines: Location[],
): Location[] {
  const tiles: Location[] = [];
  for (const direction of ALL_DIRECTIONS) {
    let current = subLocation;
    for (let i = 0; i < 3; i++) {
      current = getLocationFromDirection(current, direction);
      if (!isValidMoveTile(current, grid, path, mines)) {
        break;
      }
      tiles.push(current);
    }
  }
  return tiles;
}

// Laying mines follows the same rules as moving.
export const getMineOptions = getMoveOptions;

export function getTorpedoOptions(subLocation: Location, grid: Grid): Location[] {
  return fillFromTile(grid, subLocation, 4);
}

type SonarKey = keyof SonarResult;
const SONAR_KEYS: SonarKey[] = ["row", "column", "sector"];

/** A sonar reading: one true coordinate fact and one false one. */
export function generateSonarResult(
  location: Location,
  gridSize: Location = [15, 15],
): SonarResult {
  const shuffled = [...SONAR_KEYS].sort(() => Math.random() - 0.5);
  const truth = shuffled[0];
  const lie = shuffled[1];
  return {
    [truth]: getSonarTruth(location, truth, gridSize),
    [lie]: getSonarLie(location, lie, gridSize),
  };
}

function getSonarTruth(
  location: Location,
  key: SonarKey,
  gridSize: Location,
): number {
  switch (key) {
    case "column":
      return location[0];
    case "row":
      return location[1];
    case "sector":
      return tileToSector(location, gridSize) ?? 0;
  }
}

function getSonarLie(
  location: Location,
  key: SonarKey,
  gridSize: Location,
): number {
  switch (key) {
    case "column":
      return pickExcept(range(0, gridSize[0]), location[0]);
    case "row":
      return pickExcept(range(0, gridSize[1]), location[1]);
    case "sector": {
      const truthSector = tileToSector(location, gridSize);
      return pickExcept(range(0, 9), truthSector ?? -1);
    }
  }
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function pickExcept(values: number[], except: number): number {
  const options = values.filter((v) => v !== except);
  return options[Math.floor(Math.random() * options.length)];
}
