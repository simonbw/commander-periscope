import Immutable from 'immutable/dist/immutable';
import { ALL_DIRECTIONS } from '../Direction';
import { getNewLocation, WATER_TILE } from '../Grid';
import { ACTION_TYPE, BREAKDOWNS, DIRECTION_MOVED, SUBSYSTEMS, SYSTEMS, WINNER } from '../StateFields';
import { CHARGE, CIRCUIT, CIRCUITS, DIRECTION, getSystemType, MAX_CHARGE, NUCLEAR, SYSTEM_TYPE } from '../System';
import { deepFind } from './ImmutableUtil';

export const getPlayerPosition = (teams, playerId) => {
  const path = deepFind(teams, playerId);
  if (path) {
    const [team, role] = path.toArray();
    return { role, team }
  }
  // not found
  return undefined;
};

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

export function getMoveOptions(subLocation, grid, path, mines) {
  return Immutable.List(ALL_DIRECTIONS)
    .map(direction => getNewLocation(subLocation, direction))
    .filter(location => grid.getIn(location) === WATER_TILE)
    .filter(location => !path.includes(location))
    .filter(location => !mines.includes(location));
}