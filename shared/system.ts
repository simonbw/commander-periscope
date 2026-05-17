import type { SystemName, SystemType } from "./types";

// Systems
export const MINE = "mine" satisfies SystemName;
export const TORPEDO = "torpedo" satisfies SystemName;
export const DRONE = "drone" satisfies SystemName;
export const SONAR = "sonar" satisfies SystemName;
export const SILENT = "silent" satisfies SystemName;

export const ALL_SYSTEMS: SystemName[] = [MINE, TORPEDO, DRONE, SONAR, SILENT];

// System types
export const WEAPONS = "weapons" satisfies SystemType;
export const COMMS = "comms" satisfies SystemType;
export const SPECIAL = "special" satisfies SystemType;
export const NUCLEAR = "nuclear" satisfies SystemType;

export const SYSTEM_TYPES: SystemType[] = [WEAPONS, COMMS, SPECIAL, NUCLEAR];

/** Engineer circuits. A completed circuit clears its breakdowns. */
export const CIRCUITS = [1, 2, 3];

export function getSystemType(system: SystemName): SystemType {
  switch (system) {
    case TORPEDO:
    case MINE:
      return WEAPONS;
    case DRONE:
    case SONAR:
      return COMMS;
    case SILENT:
      return SPECIAL;
  }
}
