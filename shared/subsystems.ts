import { ALL_DIRECTIONS, EAST, NORTH, SOUTH, WEST } from "./direction";
import { CIRCUITS, COMMS, NUCLEAR, SPECIAL, SYSTEM_TYPES, WEAPONS } from "./system";
import type { Subsystem } from "./types";

/** The fixed standard engineer panel layout (24 subsystems). */
export function createStandardSubsystems(): Subsystem[] {
  return [
    { id: 0, direction: WEST, systemType: WEAPONS, circuit: 1 },
    { id: 1, direction: WEST, systemType: SPECIAL, circuit: 1 },
    { id: 2, direction: WEST, systemType: COMMS, circuit: 1 },
    { id: 3, direction: WEST, systemType: COMMS, circuit: null },
    { id: 4, direction: WEST, systemType: NUCLEAR, circuit: null },
    { id: 5, direction: WEST, systemType: NUCLEAR, circuit: null },
    { id: 6, direction: NORTH, systemType: SPECIAL, circuit: 2 },
    { id: 7, direction: NORTH, systemType: WEAPONS, circuit: 2 },
    { id: 8, direction: NORTH, systemType: SPECIAL, circuit: 2 },
    { id: 9, direction: NORTH, systemType: COMMS, circuit: null },
    { id: 10, direction: NORTH, systemType: WEAPONS, circuit: null },
    { id: 11, direction: NORTH, systemType: NUCLEAR, circuit: null },
    { id: 12, direction: SOUTH, systemType: COMMS, circuit: 3 },
    { id: 13, direction: SOUTH, systemType: SPECIAL, circuit: 3 },
    { id: 14, direction: SOUTH, systemType: WEAPONS, circuit: 3 },
    { id: 15, direction: SOUTH, systemType: WEAPONS, circuit: null },
    { id: 16, direction: SOUTH, systemType: NUCLEAR, circuit: null },
    { id: 17, direction: SOUTH, systemType: SPECIAL, circuit: null },
    { id: 18, direction: EAST, systemType: COMMS, circuit: 2 },
    { id: 19, direction: EAST, systemType: SPECIAL, circuit: 3 },
    { id: 20, direction: EAST, systemType: WEAPONS, circuit: 1 },
    { id: 21, direction: EAST, systemType: NUCLEAR, circuit: null },
    { id: 22, direction: EAST, systemType: COMMS, circuit: null },
    { id: 23, direction: EAST, systemType: NUCLEAR, circuit: null },
  ];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/** A randomized engineer panel: 12 circuit slots, 4 of each system type. */
export function createRandomSubsystems(): Subsystem[] {
  const circuits = shuffle(
    CIRCUITS.flatMap((circuit) => [circuit, circuit, circuit, circuit]),
  );
  const systemTypes = shuffle(
    SYSTEM_TYPES.flatMap((type) => [type, type, type, type, type, type]),
  );
  return systemTypes.map((systemType, i) => ({
    id: i,
    systemType,
    direction: ALL_DIRECTIONS[i % ALL_DIRECTIONS.length],
    circuit: i < 12 ? circuits[i] : null,
  }));
}
