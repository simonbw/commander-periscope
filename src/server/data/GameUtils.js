import Immutable from 'immutable';
import {
  CHARGE,
  COMMON, ENGINE_LAYOUT, GRID, ID, MAX_CHARGE, STARTED, SUB_LOCATIONS, SUB_PATHS, SYSTEMS, TEAMS, TURN_INFO, USER_ROLE,
  USER_TEAM
} from '../../common/StateFields';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import { deepFind } from '../../common/util/ImmutableUtil';
import { GameStateError } from './GameStateError';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    id: game.get(ID),
    common: game.get(COMMON)
  });
  
  const position = getPlayerPosition(game.getIn([COMMON, TEAMS]), userId);
  if (position) {
    const { team } = position;
    data = data
      .set(USER_TEAM, position.team)
      .set(USER_ROLE, position.role);
    
    switch (position.role) {
      case CAPTAIN:
        data = data
          .set(GRID, game.get(GRID))
          .set('subLocation', game.getIn([SUB_LOCATIONS, team]))
          .set('path', game.getIn([SUB_PATHS, team]))
          .set(TURN_INFO, game.getIn([TURN_INFO, team]));
        break;
      case FIRST_MATE:
        data = data
          .set(SYSTEMS, game.getIn([SYSTEMS, team]));
        break;
      case ENGINEER:
        data = data
          .set(ENGINE_LAYOUT, game.getIn([ENGINE_LAYOUT, team]));
        break;
      case RADIO_OPERATOR:
        data = data
          .set(GRID, game.get(GRID));
        break;
    }
  }
  
  return data;
};

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

export const assertStarted = (game) => {
  if (!game.getIn([COMMON, STARTED])) { // TODO: Constants
    throw new GameStateError('Game not yet started');
  }
};

export const assertNotStarted = (game) => {
  if (game.getIn([COMMON, STARTED])) { // TODO: Constants
    throw new GameStateError('Game already started');
  }
};

export const assertSystemReady = (game, team, systemName) => {
  const system = game.getIn([SYSTEMS, team, systemName]);
  if (system.get(CHARGE) < system.get(MAX_CHARGE)) { // TODO: Constants
    throw new GameStateError('System is not charged')
  }
  // TODO: Check breakdowns
};
