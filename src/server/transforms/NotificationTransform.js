import {
  DETONATE_MINE_NOTIFICATION, DRONE_NOTIFICATION, DROP_MINE_NOTIFICATION, MOVE_NOTIFICATION, NOTIFICATION_LOCATION,
  NOTIFICATION_TEAM, NOTIFICATION_TYPE, SILENT_NOTIFICATION, SONAR_NOTIFICATION, SURFACE_NOTIFICATION,
  TORPEDO_NOTIFICATION
} from '../../common/models/Notifications';
import { otherTeam } from '../../common/models/Team';

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