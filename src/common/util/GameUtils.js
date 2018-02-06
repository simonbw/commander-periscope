import Immutable from 'immutable/dist/immutable';
import { ALL_DIRECTIONS } from '../Direction';
import { getLocationFromDirection, getLocationList, getManhattanDistance, WATER_TILE } from '../Grid';
import { ACTION_TYPE, BREAKDOWNS, DIRECTION_MOVED, SUBSYSTEMS, SYSTEMS, WINNER } from '../StateFields';
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

export function getGamePhase(game) {
  if (!game) {
    return 'loading'; // TODO: Constants
  } else if (game.get(WINNER)) {
    return 'over'; // TODO: Constants
  } else {
    return 'middle'; // TODO: Constants
  }
}

export function getLastDirectionMoved(actions) {
  return actions
    .findLast(
      (action) => action.get(ACTION_TYPE) === 'move',
      null,
      Immutable.Map({})
    ).get(DIRECTION_MOVED, null)
}

export function isValidMoveTile(location, grid, path, mines) {
  return isInGrid(location, grid)
    && !path.includes(location)
    && !mines.includes(location)
    && grid.getIn(location) === WATER_TILE;
}

const isInGrid = (location, grid) => (
  location.get(0) >= 0
  && location.get(1) >= 0
  && location.get(0) <= grid.size
  && location.get(1) <= grid.get(0).size
);

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
      for (const i of Immutable.Range(0, 4)) {
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
    .filter(location => isInGrid(location, grid))
    .filter(location => grid.getIn(location) === WATER_TILE)
    .filter(tile => Immutable.Range(1, 4).includes(getManhattanDistance(tile, subLocation)));
}