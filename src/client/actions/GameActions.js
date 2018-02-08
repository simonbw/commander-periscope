import * as Messages from '../../common/Messages';
// Sent by server
import { sendMessage } from './GeneralActions';

// TODO: Some way to make it easy to be consistent between field names here and on the server

/// --------------- ///
/// Captain Actions ///
/// --------------- ///

export const setStartLocation = (location) => (
  sendMessage(Messages.SET_START_LOCATION_MESSAGE, { location })
);

export const headInDirection = (direction) => (
  sendMessage(Messages.HEAD_IN_DIRECTION_MESSAGE, { direction })
);

export const fireTorpedo = (location) => (
  sendMessage(Messages.FIRE_TORPEDO_MESSAGE, { location })
);

export const dropMine = (location) => (
  sendMessage(Messages.DROP_MINE_MESSAGE, { location })
);

export const detonateMine = (location) => (
  sendMessage(Messages.DETONATE_MINE_MESSAGE, { location })
);

export const useSonar = () => (
  sendMessage(Messages.USE_SONAR_MESSAGE)
);

export const useDrone = (sector) => (
  sendMessage(Messages.USE_DRONE_MESSAGE, { sector })
);

export const goSilent = (location) => (
  sendMessage(Messages.GO_SILENT_MESSAGE, { location })
);

const surface = () => (
  sendMessage(Messages.SURFACE_MESSAGE)
);

/// ------------------ ///
/// First Mate Actions ///
/// ------------------ ///

export const chargeSystem = (systemName) => (
  sendMessage(Messages.CHARGE_SYSTEM_MESSAGE, { systemName })
);

/// --------------- ///
// Engineer Actions
/// --------------- ///

export const trackBreakdown = (breakdownIndex) => (
  sendMessage(Messages.TRACK_BREAKDOWN_MESSAGE, { breakdownIndex })
);