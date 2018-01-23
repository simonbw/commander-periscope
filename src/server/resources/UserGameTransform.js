import Immutable from 'immutable';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import {
  ACTION_TYPE,
  ACTIONS,
  BREAKDOWNS,
  COMMON,
  DIRECTION_MOVED,
  GRID,
  ID, LAST_DIRECTION_MOVED,
  OPPONENT_ACTIONS,
  SUB_LOCATION,
  SUB_PATH,
  SUBSYSTEMS,
  SYSTEMS,
  TEAMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { otherTeam } from '../../common/Team';
import { canUseSystem, getLastDirectionMoved, getPlayerPosition } from '../../common/util/GameUtils';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    [ID]: game.get(ID),
    [COMMON]: game.get(COMMON)
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
          .set(WAITING_FOR_FIRST_MATE, teamInfo.getIn([TURN_INFO, WAITING_FOR_FIRST_MATE]));
        break;
      case ENGINEER:
        data = data
          .set(SUBSYSTEMS, game.get(SUBSYSTEMS))
          .set(BREAKDOWNS, teamInfo.get(BREAKDOWNS))
          .set(WAITING_FOR_ENGINEER, teamInfo.getIn([TURN_INFO, WAITING_FOR_ENGINEER]))
          .set(LAST_DIRECTION_MOVED, getLastDirectionMoved(teamInfo.get(ACTIONS)));
        break;
      case RADIO_OPERATOR:
        const opponentActions = game.getIn([otherTeam(team), ACTIONS]).takeLast(5).reverse(); // TODO: Constant
        data = data
          .set(GRID, game.get(GRID))
          .set(OPPONENT_ACTIONS, opponentActions);
        break;
    }
  }
  
  return data;
};