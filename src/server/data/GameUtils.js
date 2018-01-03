import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import { deepFind } from '../../common/util/ImmutableUtil';
import { GameStateError } from './GameStateError';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    id: game.get('id'),
    common: game.get('common')
  });
  
  const position = getPlayerPosition(game.getIn(['common', 'teams']), userId);
  if (position) {
    const { team } = position;
    data = data
      .set('team', position.team)
      .set('role', position.role);
    
    switch (position.role) {
      case CAPTAIN:
        data = data
          .set('grid', game.get('grid'))
          .set('subLocation', game.getIn(['subLocations', team]))
          .set('path', game.getIn(['subPaths', team]))
          .set('turnInfo', game.getIn(['turnInfo', team]));
        break;
      case FIRST_MATE:
        data = data
          .set('systems', game.getIn(['systems', team]))
        break;
      case ENGINEER:
        data = data
          .set('engine', game.getIn(['engines', team]));
        break;
      case RADIO_OPERATOR:
        data = data
          .set('grid', game.get('grid'));
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
  if (!game.getIn(['common', 'started'])) { // TODO: Constants
    throw new GameStateError('Game not yet started');
  }
};

export const assertNotStarted = (game) => {
  if (game.getIn(['common', 'started'])) { // TODO: Constants
    throw new GameStateError('Game already started');
  }
};

export const assertSystemReady = (game, team, systemName) => {
  const system = game.getIn(['systems', team, systemName]);
  if (system.get('charge') < system.get('max')) { // TODO: Constants
    throw new GameStateError('System is not charged')
  }
  // TODO: Check breakdowns
};
