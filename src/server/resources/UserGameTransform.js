import Immutable from 'immutable';
import {
  DETONATE_MINE_NOTIFICATION, DRONE_NOTIFICATION, DROP_MINE_NOTIFICATION, MOVE_NOTIFICATION, NOTIFICATION_LOCATION,
  NOTIFICATION_TEAM, NOTIFICATION_TYPE, SILENT_NOTIFICATION, SONAR_NOTIFICATION, SURFACE_NOTIFICATION,
  TORPEDO_NOTIFICATION
} from '../../common/Notifications';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import {
  BREAKDOWNS, COMMON, GRID, ID, LAST_DIRECTION_MOVED, MINE_LOCATIONS, NOTIFICATIONS, SUB_LOCATION, SUB_PATH, SUBSYSTEMS,
  SURFACED, SYSTEMS, TEAMS, TURN_INFO, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { otherTeam } from '../../common/Team';
import { canUseSystem, getLastDirectionMoved, getPlayerPosition } from '../../common/util/GameUtils';

export const getDataForUser = (game, userId) => {
  let data = Immutable.Map({
    [ID]: game.get(ID),
    [COMMON]: game.get(COMMON)
  });
  
  const position = getPlayerPosition(game.getIn([COMMON, TEAMS]), userId);
  if (!position) {
    throw new Error(`Cannot get data for user: ${userId}`);
  }
  const { team, role } = position;
  const teamInfo = game.get(team);
  
  data = data.set(SURFACED, teamInfo.get(SURFACED));
  
  switch (role) {
    case CAPTAIN:
      const systemStatuses = teamInfo.get(SYSTEMS).map((system, name) => canUseSystem(game, team, name));
      data = data
        .set(GRID, game.get(GRID))
        .set(SUB_LOCATION, teamInfo.get(SUB_LOCATION))
        .set(SUB_PATH, teamInfo.get(SUB_PATH))
        .set(TURN_INFO, teamInfo.get(TURN_INFO))
        .set(MINE_LOCATIONS, teamInfo.get(MINE_LOCATIONS))
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
        .set(LAST_DIRECTION_MOVED, getLastDirectionMoved(game.get(NOTIFICATIONS), team));
      break;
    case RADIO_OPERATOR:
      const notifications = game.get(NOTIFICATIONS)
        .map(transformNotificationForRadioOperator(team))
        .filter(notification => notification != null)
        .takeLast(5)
        .reverse();
      data = data
        .set(GRID, game.get(GRID))
        .set(NOTIFICATIONS, notifications);
      break;
  }
  
  return data;
};

export const transformNotificationForRadioOperator = (playerTeam) => (notification) => {
  if (notification.get(NOTIFICATION_TEAM) === otherTeam(playerTeam)) {
    switch (notification.get(NOTIFICATION_TYPE)) {
      // don't need to remove data
      case MOVE_NOTIFICATION:
      case TORPEDO_NOTIFICATION:
      case DETONATE_MINE_NOTIFICATION:
      case SURFACE_NOTIFICATION:
        return notification;
      // need to remove data
      case DROP_MINE_NOTIFICATION:
      case SILENT_NOTIFICATION:
        return notification.remove(NOTIFICATION_LOCATION);
    }
  } else { // player team did something
    switch (notification.get(NOTIFICATION_TYPE)) {
      case SONAR_NOTIFICATION:
      case DRONE_NOTIFICATION:
      case TORPEDO_NOTIFICATION:
      case DETONATE_MINE_NOTIFICATION:
        return notification
    }
  }
  return null;
};