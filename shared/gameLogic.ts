// Pure game-state transitions. Each function takes a Game and returns the next
// Game, throwing GameStateError on an illegal action. These were the bodies of
// the Games.* mutators in src/server/resources/Games.js; the Convex mutations
// in convex/games.ts are thin wrappers around them.

import { produce, type Draft } from "immer";
import {
  assert,
  assertCanMove,
  assertCanMoveTo,
  assertCanSurface,
  assertMainPhase,
  assertNotStarted,
  assertSystemReady,
  assertValidStartLocation,
} from "./assertions";
import { getExplosionDamage, getExplosionResult } from "./explosion";
import {
  checkEngineOverload,
  fixCircuits,
  generateSonarResult,
  getLastDirectionMoved,
} from "./gameUtils";
import { ENDED_PHASE, MAIN_PHASE } from "./gamePhase";
import {
  getDirection,
  getGridSize,
  getLocationFromDirection,
  getManhattanDistance,
  includesLocation,
  isAdjacent,
  locEq,
  tileToSector,
} from "./grid";
import {
  appendNotification,
  createDetonateMineNotification,
  createDroneNotification,
  createDropMineNotification,
  createMoveNotification,
  createSilentNotification,
  createSonarNotification,
  createSurfaceNotification,
  createTorpedoNotification,
} from "./notifications";
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from "./system";
import { otherTeam } from "./team";
import type { Direction, Game, Location, SystemName, Team } from "./types";

function cloneLoc(l: Location): Location {
  return [l[0], l[1]];
}

function causeDamage(draft: Draft<Game>, team: Team, amount: number): void {
  const ts = draft.teamState[team];
  if (amount >= ts.hitPoints) {
    ts.hitPoints = 0;
    draft.phase = ENDED_PHASE;
    draft.winner = otherTeam(team);
  } else {
    ts.hitPoints -= amount;
  }
}

function applyExplosion(
  draft: Draft<Game>,
  team: Team,
  explosionLocation: Location,
  currentLocation: Location,
  opponentLocation: Location,
): void {
  causeDamage(
    draft,
    otherTeam(team),
    getExplosionDamage(getExplosionResult(opponentLocation, explosionLocation)),
  );
  causeDamage(
    draft,
    team,
    getExplosionDamage(getExplosionResult(currentLocation, explosionLocation)),
  );
}

/** Assert a system is ready, run `onUse`, then discharge it and end the turn. */
function useSystem(
  draft: Draft<Game>,
  team: Team,
  systemName: SystemName,
  onUse: (draft: Draft<Game>) => void,
): void {
  assertSystemReady(draft, team, systemName);
  onUse(draft);
  draft.teamState[team].systems[systemName].charge = 0;
  draft.teamState[team].turnInfo.usedSystem = true;
}

/// Captain ///

export function setStartLocation(
  game: Game,
  team: Team,
  location: Location,
): Game {
  return produce(game, (draft) => {
    assertNotStarted(draft);
    assertValidStartLocation(location, draft.grid);
    draft.teamState[team].subLocation = cloneLoc(location);
    if (draft.teamState.red.subLocation && draft.teamState.blue.subLocation) {
      draft.phase = MAIN_PHASE;
    }
  });
}

export function headInDirection(
  game: Game,
  team: Team,
  direction: Direction,
): Game {
  return produce(game, (draft) => {
    assertCanMove(draft, team);
    const ts = draft.teamState[team];
    const current = ts.subLocation!;
    const next = getLocationFromDirection(current, direction);
    assertCanMoveTo(next, draft.grid, ts.subPath, ts.mineLocations);

    ts.turnInfo.waitingForEngineer = true;
    ts.turnInfo.waitingForFirstMate = true;
    ts.turnInfo.usedSystem = false;
    ts.turnInfo.turnNumber += 1;
    ts.subPath.push(cloneLoc(current));
    appendNotification(draft.notifications, createMoveNotification(team, direction));
    ts.subLocation = next;
  });
}

export function fireTorpedo(game: Game, team: Team, target: Location): Game {
  return produce(game, (draft) => {
    useSystem(draft, team, TORPEDO, (d) => {
      const current = d.teamState[team].subLocation!;
      const opponent = d.teamState[otherTeam(team)].subLocation!;
      const distance = getManhattanDistance(current, target);
      assert(distance <= 4, `Torpedo target must within 4 squares (was ${distance})`);
      const hitResult = getExplosionResult(target, opponent);
      applyExplosion(d, team, target, current, opponent);
      appendNotification(
        d.notifications,
        createTorpedoNotification(team, cloneLoc(target), hitResult),
      );
    });
  });
}

export function dropMine(game: Game, team: Team, location: Location): Game {
  return produce(game, (draft) => {
    useSystem(draft, team, MINE, (d) => {
      const ts = d.teamState[team];
      const current = ts.subLocation!;
      assert(!locEq(current, location), "cannot drop a mine on self");
      assert(isAdjacent(location, current), "must drop mine on adjacent location");
      assert(!includesLocation(ts.subPath, location), "cannot drop a mine on your path");
      assert(
        !includesLocation(ts.mineLocations, location),
        "cannot drop a mine on an existing mine",
      );
      ts.mineLocations.push(cloneLoc(location));
      appendNotification(
        d.notifications,
        createDropMineNotification(team, cloneLoc(location)),
      );
    });
  });
}

export function useSonar(game: Game, team: Team): Game {
  return produce(game, (draft) => {
    useSystem(draft, team, SONAR, (d) => {
      const opponent = d.teamState[otherTeam(team)].subLocation!;
      const result = generateSonarResult(cloneLoc(opponent), getGridSize(d.grid));
      appendNotification(d.notifications, createSonarNotification(team, result));
    });
  });
}

export function useDrone(game: Game, team: Team, sector: number): Game {
  return produce(game, (draft) => {
    useSystem(draft, team, DRONE, (d) => {
      assert(sector >= 0 && sector < 9, "Must choose a sector 0 <= sector <= 8");
      const opponent = d.teamState[otherTeam(team)].subLocation!;
      const result =
        tileToSector(cloneLoc(opponent), getGridSize(d.grid)) === sector;
      appendNotification(
        d.notifications,
        createDroneNotification(team, sector, result),
      );
    });
  });
}

export function goSilent(game: Game, team: Team, destination: Location): Game {
  return produce(game, (draft) => {
    assertSystemReady(draft, team, SILENT);
    const ts = draft.teamState[team];
    const grid = draft.grid;
    const [x, y] = destination;
    assert(
      x >= 0 && y >= 0 && x <= grid.length && y <= grid[0].length,
      "Cannot move out of bounds",
    );
    const start = ts.subLocation!;
    assert(
      getManhattanDistance(start, destination) <= 3,
      "Cannot move more than 3 spaces while silent",
    );
    assert(
      start[0] === destination[0] || start[1] === destination[1],
      "Must move in a straight line",
    );

    ts.subPath.push(cloneLoc(start));
    if (!locEq(start, destination)) {
      const direction = getDirection(start, destination)!;
      let current: Location = start;
      while (!locEq(current, destination)) {
        current = getLocationFromDirection(current, direction);
        assertCanMoveTo(current, grid, ts.subPath, ts.mineLocations);
        ts.subPath.push(cloneLoc(current));
      }
    }

    ts.subLocation = cloneLoc(destination);
    ts.systems.silent.charge = 0;
    appendNotification(
      draft.notifications,
      createSilentNotification(team, cloneLoc(destination)),
    );
  });
}

// Not the same as dropMine: can be used whenever you have a mine.
export function detonateMine(
  game: Game,
  team: Team,
  mineLocation: Location,
): Game {
  return produce(game, (draft) => {
    const ts = draft.teamState[team];
    assert(
      includesLocation(ts.mineLocations, mineLocation),
      `You don't have a mine at: ${mineLocation}`,
    );
    const current = ts.subLocation!;
    const opponent = draft.teamState[otherTeam(team)].subLocation!;

    applyExplosion(draft, team, mineLocation, current, opponent);
    const result = getExplosionResult(opponent, mineLocation);
    ts.mineLocations = ts.mineLocations.filter((m) => !locEq(m, mineLocation));
    appendNotification(
      draft.notifications,
      createDetonateMineNotification(team, cloneLoc(mineLocation), result),
    );
  });
}

/**
 * Begin surfacing. The opposing-clearable timer that ends the surface is the
 * caller's responsibility (a Convex scheduled call to surfaceEnd).
 */
export function surfaceStart(game: Game, team: Team): Game {
  return produce(game, (draft) => {
    assertCanSurface(draft, team);
    const ts = draft.teamState[team];
    const sector = tileToSector(ts.subLocation, getGridSize(draft.grid));
    ts.surfaced = true;
    appendNotification(
      draft.notifications,
      createSurfaceNotification(team, sector ?? 0),
    );
  });
}

export function surfaceEnd(game: Game, team: Team): Game {
  return produce(game, (draft) => {
    const ts = draft.teamState[team];
    ts.surfaced = false;
    ts.subPath = [];
    ts.breakdowns = [];
    ts.turnInfo.waitingForFirstMate = false;
    ts.turnInfo.waitingForEngineer = false;
  });
}

/// First Mate ///

export function chargeSystem(
  game: Game,
  team: Team,
  systemName?: SystemName,
): Game {
  return produce(game, (draft) => {
    assertMainPhase(draft);
    const ts = draft.teamState[team];
    assert(ts.turnInfo.waitingForFirstMate, "First Mate has already gone");

    // An undefined system name means "skip charging this turn".
    if (systemName) {
      assert(
        systemName in ts.systems,
        `Cannot charge unknown system: ${systemName}`,
      );
      const system = ts.systems[systemName];
      system.charge = Math.min(system.charge + 1, system.maxCharge);
    }

    ts.turnInfo.waitingForFirstMate = false;
  });
}

/// Engineer ///

export function trackBreakdown(
  game: Game,
  team: Team,
  breakdownIndex: number,
): Game {
  return produce(game, (draft) => {
    assertMainPhase(draft);
    const ts = draft.teamState[team];
    assert(ts.turnInfo.waitingForEngineer, "Engineer has already gone");

    const brokenSubsystem = draft.subsystems[breakdownIndex];
    assert(brokenSubsystem, `Invalid Breakdown: ${breakdownIndex}`);

    const directionMoved = getLastDirectionMoved(draft.notifications, team);
    assert(
      brokenSubsystem.direction === directionMoved,
      `Breakdown must be in direction moved. Expected ${directionMoved}, ` +
        `Actual ${brokenSubsystem.direction}`,
    );
    assert(
      !ts.breakdowns.includes(breakdownIndex),
      `Subsystem already broken: ${breakdownIndex}`,
    );

    ts.breakdowns.push(breakdownIndex);
    ts.breakdowns = fixCircuits(draft.subsystems, ts.breakdowns);

    if (checkEngineOverload(draft.subsystems, ts.breakdowns)) {
      // NOTE: the original (src/server/resources/Games.js) discarded the
      // result of clearing breakdowns here — a bug. This implements the
      // intended behavior: the reactor overload clears breakdowns and deals 1.
      ts.breakdowns = [];
      causeDamage(draft, team, 1);
    }

    ts.turnInfo.waitingForEngineer = false;
  });
}

/// Radio Operator has no game actions. ///
