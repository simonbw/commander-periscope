// System Fields
export const CHARGE = 'charge';
export const MAX_CHARGE = 'max_charge';

// Subsystem Fields
export const SYSTEM_TYPE = 'systemType';
export const DIRECTION = 'direction';
export const CIRCUIT = 'circuit';

// Systems
export const MINE = 'mine';
export const TORPEDO = 'torpedo';
export const DRONE = 'drone';
export const SONAR = 'sonar';
export const SILENT = 'silent';

export const ALL_SYSTEMS = [MINE, TORPEDO, DRONE, SONAR, SILENT];

// System Types
export const WEAPONS = 'weapons';
export const COMMS = 'comms';
export const SPECIAL = 'special';
export const NUCLEAR = 'nuclear';

export const SYSTEM_TYPES = [WEAPONS, COMMS, SPECIAL, NUCLEAR];

export function getSystemType(system) {
  switch (system) {
    case TORPEDO:
    case MINE:
      return WEAPONS;
    case DRONE:
    case SONAR:
      return COMMS;
    case SILENT:
      return SPECIAL;
    default:
      throw Error(`Unrecognized system: ${system}`);
  }
}

export const CIRCUITS = [1, 2, 3];