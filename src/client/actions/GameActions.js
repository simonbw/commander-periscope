import {
  CHARGE_SYSTEM_MESSAGE, DETONATE_MINE_MESSAGE, DROP_MINE_MESSAGE, FIRE_TORPEDO_MESSAGE, GO_SILENT_MESSAGE,
  HEAD_IN_DIRECTION_MESSAGE, SET_START_LOCATION_MESSAGE, SURFACE_MESSAGE, TRACK_BREAKDOWN_MESSAGE, USE_DRONE_MESSAGE,
  USE_SONAR_MESSAGE
} from '../../common/messages/GameMessages';
// Sent by server
import { sendMessage } from './GeneralActions';

// TODO: Some way to make it easy to be consistent between field names here and on the server

/// --------------- ///
/// Captain Actions ///
/// --------------- ///

export const setStartLocation = (location) => (
  sendMessage(SET_START_LOCATION_MESSAGE, { location })
);

export const headInDirection = (direction) => (
  sendMessage(HEAD_IN_DIRECTION_MESSAGE, { direction })
);

export const fireTorpedo = (location) => (
  sendMessage(FIRE_TORPEDO_MESSAGE, { location })
);

export const dropMine = (location) => (
  sendMessage(DROP_MINE_MESSAGE, { location })
);

export const detonateMine = (location) => (
  sendMessage(DETONATE_MINE_MESSAGE, { location })
);

export const useSonar = () => (
  sendMessage(USE_SONAR_MESSAGE)
);

export const useDrone = (sector) => (
  sendMessage(USE_DRONE_MESSAGE, { sector })
);

export const goSilent = (location) => (
  sendMessage(GO_SILENT_MESSAGE, { location })
);

export const surface = () => (
  sendMessage(SURFACE_MESSAGE)
);

/// ------------------ ///
/// First Mate Actions ///
/// ------------------ ///

export const chargeSystem = (systemName) => (
  sendMessage(CHARGE_SYSTEM_MESSAGE, { systemName })
);

/// --------------- ///
// Engineer Actions
/// --------------- ///

export const trackBreakdown = (breakdownIndex) => (
  sendMessage(TRACK_BREAKDOWN_MESSAGE, { breakdownIndex })
);