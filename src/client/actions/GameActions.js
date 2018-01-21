import * as Messages from '../../common/Messages';
// Sent by server
import { sendMessage } from './GeneralActions';

// TODO: Some way to make it easy to be consistent between field names here and on the server

/// --------------- ///
/// Captain Actions ///
/// --------------- ///

export const setStartLocation = (location) => (
  sendMessage(Messages.SET_START_LOCATION, { location })
);

export const headInDirection = (direction) => (
  sendMessage(Messages.HEAD_IN_DIRECTION, { direction })
);

export const fireTorpedo = (location) => (
  sendMessage(Messages.FIRE_TORPEDO, { location })
);

export const dropMine = (location) => (
  sendMessage(Messages.DROP_MINE, { location })
);

export const detonateMine = (location) => (
  sendMessage(Messages.DETONATE_MINE, { location })
);

export const useSonar = () => (
  sendMessage(Messages.USE_SONAR, {})
);

export const useDrone = (sector) => (
  sendMessage(Messages.USE_DRONE, { sector })
);

export const goSilent = () => (
  sendMessage(Messages.GO_SILENT, {})
);

/// ------------------ ///
/// First Mate Actions ///
/// ------------------ ///

export const chargeSystem = (systemName) => (
  sendMessage(Messages.CHARGE_SYSTEM, { systemName })
);

/// --------------- ///
// Engineer Actions
/// --------------- ///

export const trackBreakdown = (breakdownIndex) => (
  sendMessage(Messages.TRACK_BREAKDOWN, { breakdownIndex })
);