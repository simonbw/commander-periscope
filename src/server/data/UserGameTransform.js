import Immutable from 'immutable/dist/immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import {
  COMMON, ENGINE_LAYOUT, GRID, ID, SUB_LOCATION, SUB_PATH, SYSTEMS, TEAMS,
  TURN_INFO, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { canUseSystem, getPlayerPosition } from './GameUtils';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    id: game.get(ID),
    common: game.get(COMMON)
  });
  
  const position = getPlayerPosition(game.getIn([COMMON, TEAMS]), userId);
  if (position) {
    const { team, role } = position;
    const teamInfo = game.get(team);
    
    switch (role) {
      case CAPTAIN:
        const systemStatuses = teamInfo.get(SYSTEMS).map((system, name) => canUseSystem(game, team, name));
        data = data
          .set(GRID, game.get(GRID))
          .set(SUB_LOCATION, teamInfo.get(SUB_LOCATION))
          .set(SUB_PATH, teamInfo.get(SUB_PATH))
          .set(TURN_INFO, teamInfo.get(TURN_INFO))
          .set(SYSTEMS, systemStatuses); // TODO: Do we want this to be a different key?
        break;
      case FIRST_MATE:
        data = data
          .set(SYSTEMS, teamInfo.get(SYSTEMS))
          .set(WAITING_FOR_FIRST_MATE, teamInfo.getIn([TURN_INFO, WAITING_FOR_FIRST_MATE])); // TODO: Do we want this to be a different key?
        break;
      case ENGINEER:
        data = data
          .set(ENGINE_LAYOUT, teamInfo.get(ENGINE_LAYOUT));
        break;
      case RADIO_OPERATOR:
        data = data
          .set(GRID, game.get(GRID));
        break;
    }
  }
  
  return data;
};