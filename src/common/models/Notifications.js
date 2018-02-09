import Immutable from "immutable";

export const NOTIFICATION_TYPE = 'NOTIFICATION_TYPE';
export const NOTIFICATION_ID = 'NOTIFICATION_ID';
export const NOTIFICATION_TEAM = 'NOTIFICATION_TEAM';

export const DETONATE_MINE_NOTIFICATION = 'DETONATE_MINE_NOTIFICATION';
export const DRONE_NOTIFICATION = 'DRONE_NOTIFICATION';
export const DROP_MINE_NOTIFICATION = 'DROP_MINE_NOTIFICATION';
export const MOVE_NOTIFICATION = 'MOVE_NOTIFICATION';
export const SILENT_NOTIFICATION = 'SILENT_NOTIFICATION';
export const SONAR_NOTIFICATION = 'SONAR_NOTIFICATION';
export const SURFACE_NOTIFICATION = 'SURFACE_NOTIFICATION';
export const TORPEDO_NOTIFICATION = 'TORPEDO_NOTIFICATION';

export const NOTIFICATION_DIRECTION = 'NOTIFICATION_DIRECTION';
export const NOTIFICATION_LOCATION = 'NOTIFICATION_LOCATION';
export const NOTIFICATION_SECTOR = 'NOTIFICATION_SECTOR';
export const NOTIFICATION_DRONE_RESULT = 'NOTIFICATION_DRONE_RESULT';
export const NOTIFICATION_SONAR_RESULT = 'NOTIFICATION_SONAR_RESULT';
export const NOTIFICATION_HIT_RESULT = 'NOTIFICATION_HIT_RESULT';

export const notificationAdder = (notification) => notifications => (
  notifications.push(notification.set(NOTIFICATION_ID, notifications.size))
);

export function createDetonateMineNotification(team, location, hitResult) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: DETONATE_MINE_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_LOCATION]: location,
    [NOTIFICATION_HIT_RESULT]: hitResult,
  })
}

export function createDroneNotification(team, sector, result) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: DRONE_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_SECTOR]: sector,
    [NOTIFICATION_DRONE_RESULT]: result,
  });
}

export function createDropMineNotification(team, location) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: DROP_MINE_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_LOCATION]: location,
  });
}

export function createMoveNotification(team, direction) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: MOVE_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_DIRECTION]: direction,
  });
}

export function createSilentNotification(team, location) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: SILENT_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_LOCATION]: location,
  });
}

export function createSonarNotification(team, result) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: SONAR_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_SONAR_RESULT]: result,
  });
}

export function createSurfaceNotification(team, sector) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: SURFACE_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_SECTOR]: sector,
  });
}

export function createTorpedoNotification(team, location, hitResult) {
  return Immutable.Map({
    [NOTIFICATION_TYPE]: TORPEDO_NOTIFICATION,
    [NOTIFICATION_TEAM]: team,
    [NOTIFICATION_LOCATION]: location,
    [NOTIFICATION_HIT_RESULT]: hitResult,
  });
}
