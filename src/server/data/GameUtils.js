import Immutable from 'immutable';
import { deepFind } from '../util/ImmutableUtil';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    id: game.get('id'),
    common: game.get('common')
  });
  
  const position = getPlayerPosition(game.getIn(['common', 'teams']), userId);
  if (position) {
    data = data
      .set('team', position.team) // TODO: This is redundant. It's information that's available in common.
      .set('role', position.role);
    
    switch (position.role) {
      case 'captain': // TODO: Constants
        data = data
          .set('grid', game.get('grid'))
          .set('subLocation', game.getIn(['subLocations', position.team]))
          .set('path', game.getIn(['subPaths', position.team]));
        break;
      case 'first_mate': // TODO: Constants
        data = data
          .set('systems', game.getIn(['systems', position.team]));
        break;
      case 'engineer': // TODO: Constants
        data = data
          .set('engine', game.getIn(['engines', position.team]));
        break;
      case 'radio_operator': // TODO: Constants
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
