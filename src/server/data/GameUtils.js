import { CHARGE, COMMON, MAX_CHARGE, STARTED, SYSTEMS } from '../../common/StateFields';
import { deepFind } from '../../common/util/ImmutableUtil';
import { GameStateError } from './GameStateError';

export const getPlayerPosition = (teams, playerId) => {
  const path = deepFind(teams, playerId);
  if (path) {
    return {
      team: path.get(0),
      role: path.get(1)
    };
  }
  // not found
  return undefined;
};

export function canUseSystem(game, team, systemName) {
  const system = game.getIn([team, SYSTEMS, systemName]);
  if (system.get(CHARGE) < system.get(MAX_CHARGE)) {
    return false;
  }
  // TODO: Check breakdowns
  return true;
}

export const assertStarted = (game) => {
  if (!game.getIn([COMMON, STARTED])) {
    throw new GameStateError('Game not yet started');
  }
};

export const assertNotStarted = (game) => {
  if (game.getIn([COMMON, STARTED])) {
    throw new GameStateError('Game already started');
  }
};

function assertSystemReady(game, team, systemName) {
  const system = game.getIn([SYSTEMS, team, systemName]);
  if (system.get(CHARGE) < system.get(MAX_CHARGE)) {
    throw new GameStateError('System is not charged')
  }
  // TODO: Check breakdowns
}
