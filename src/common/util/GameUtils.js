import Immutable from 'immutable/dist/immutable';
import Random from 'random-js';
import { ALL_DIRECTIONS } from '../Direction';
import { BREAKDOWNS, SUBSYSTEMS, SYSTEMS } from '../fields/GameFields';
import {
  getGridSize, getLocationFromDirection, getLocationList, getManhattanDistance, isInGrid, tileToSector, WATER_TILE
} from '../Grid';
import { MOVE_NOTIFICATION, NOTIFICATION_DIRECTION, NOTIFICATION_TEAM, NOTIFICATION_TYPE } from '../Notifications';
import { CHARGE, CIRCUIT, CIRCUITS, DIRECTION, getSystemType, MAX_CHARGE, NUCLEAR, SYSTEM_TYPE } from '../System';
import { deepFind } from './ImmutableUtil';

export function getPlayerPosition(teams, playerId) {
  const path = deepFind(teams, playerId);
  if (path) {
    const [team, role] = path.toArray();
    return { role, team }
  }
  // not found
  return undefined;
}

export function isValidStartLocation(location, grid) {
  if (!location) {
    return false;
  }
  return grid.getIn(location) === WATER_TILE;
  
}

export function canUseSystem(game, team, systemName) {
  // TODO: Check system already used
  // Must be charged
  const system = game.getIn([team, SYSTEMS, systemName]);
  if (system.get(CHARGE) < system.get(MAX_CHARGE)) {
    return false;
  }
  // Must not be broken
  const systemType = getSystemType(systemName);
  const subsystems = game.get(SUBSYSTEMS);
  for (const breakdownIndex of game.getIn([team, BREAKDOWNS])) {
    if (subsystems.getIn([breakdownIndex, SYSTEM_TYPE]) === systemType) {
      return false;
    }
  }
  
  return true;
}

export function fixCircuits(game, team) {
  for (const circuit of CIRCUITS) {
    const circuitIndexes = game.get(SUBSYSTEMS)
      .toKeyedSeq()
      .filter((s) => s.get(CIRCUIT) === circuit)
      .keySeq()
      .toSet();
    if (circuitIndexes.every((i) => game.getIn([team, BREAKDOWNS]).includes(i))) {
      game = game.updateIn([team, BREAKDOWNS], breakdowns => breakdowns.subtract(circuitIndexes));
    }
  }
  return game;
}

// Returns true if the engine should cause damage, otherwise false
export function checkEngineOverload(subsystems, breakdowns) {
  return subsystems // entire direction is broken
      .toKeyedSeq()
      .groupBy((s) => s.get(DIRECTION))
      .some(group => group.keySeq().isSubset(breakdowns))
    || subsystems // or all nuclear are broken
      .toKeyedSeq()
      .filter((s) => s.get(SYSTEM_TYPE) === NUCLEAR)
      .keySeq()
      .isSubset(breakdowns);
}

export function getLastDirectionMoved(notifications, team) {
  return notifications.findLast(
    (notification) =>
      notification.get(NOTIFICATION_TEAM) === team
      && notification.get(NOTIFICATION_TYPE) === MOVE_NOTIFICATION,
    null,
    Immutable.Map({})
  ).get(NOTIFICATION_DIRECTION, null)
}

export function isValidMoveTile(location, grid, path, mines) {
  return isInGrid(location, getGridSize(grid))
    && !path.includes(location)
    && !mines.includes(location)
    && grid.getIn(location) === WATER_TILE;
}

export function getMoveOptions(subLocation, grid, path, mines) {
  return Immutable.List(ALL_DIRECTIONS)
    .map(direction => getLocationFromDirection(subLocation, direction))
    .filter(location => isValidMoveTile(location, grid, path, mines));
}

export function getSilentOptions(subLocation, grid, path, mines) {
  return Immutable.List(ALL_DIRECTIONS)
    .flatMap(direction => {
      let tiles = Immutable.List();
      let current = subLocation;
      for (const i of Immutable.Range(0, 3)) {
        current = getLocationFromDirection(current, direction);
        if (!isValidMoveTile(current, grid, path, mines)) {
          break;
        }
        tiles = tiles.push(current);
      }
      return tiles;
    })
}

export function getMineOptions(subLocation, grid, path, mines) {
  // It turns out that laying mines has all the same rules as moving
  return getMoveOptions(subLocation, grid, path, mines);
}

// TODO: This is slightly incorrect. We want to do a flood fill on water tiles from this location
export function getTorpedoOptions(subLocation, grid) {
  return getLocationList(grid)
    .filter(location => isInGrid(location, getGridSize(grid)))
    .filter(location => grid.getIn(location) === WATER_TILE)
    .filter(tile => Immutable.Range(1, 4).includes(getManhattanDistance(tile, subLocation)));
}

const r = Random();

export function generateSonarResult(location) {
  const [truth, lie] = r.sample(['row', 'column', 'sector'], 2);
  
  return Immutable.Map({
    [truth]: getTruth(location, truth),
    [lie]: getLie(location, lie)
  }).sortBy((v, k) => k);
}

function getTruth(location, type) {
  switch (type) {
    case 'column':
      return location.get(0);
    case 'row':
      return location.get(1);
    case 'sector':
      return tileToSector(location, getGridSize()); // TODO: Real grid size
  }
}

function getLie(location, type) {
  const gridSize = getGridSize(); // TODO: Real grid size
  switch (type) {
    case 'column':
      return r.pick(Immutable.Range(0, gridSize.get(0)).filter(x => x !== location.get(0)).toArray());
    case 'row':
      return r.pick(Immutable.Range(0, gridSize.get(1)).filter(x => x !== location.get(1)).toArray());
    case 'sector':
      const truthSector = tileToSector(location, gridSize);
      return r.pick(Immutable.Range(0, 9).filter(s => s !== truthSector).toArray()); // TODO: Don't hardcode 9
  }
}