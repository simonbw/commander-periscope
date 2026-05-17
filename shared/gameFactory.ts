import { PICK_PHASE } from "./gamePhase";
import { createBravoGrid } from "./grids";
import { createStandardSubsystems } from "./subsystems";
import type {
  Game,
  Grid,
  Lobby,
  SystemCharge,
  SystemName,
  Subsystem,
  Team,
  TeamRoster,
  TeamState,
} from "./types";

export const MAX_HIT_POINTS = 4;

export function createSystems(): Record<SystemName, SystemCharge> {
  return {
    mine: { charge: 0, maxCharge: 3 },
    torpedo: { charge: 0, maxCharge: 3 },
    drone: { charge: 0, maxCharge: 4 },
    sonar: { charge: 0, maxCharge: 3 },
    silent: { charge: 0, maxCharge: 6 },
  };
}

export function createTeamState(): TeamState {
  return {
    turnInfo: {
      usedSystem: false,
      turnNumber: 0,
      waitingForEngineer: false,
      waitingForFirstMate: false,
    },
    breakdowns: [],
    hitPoints: MAX_HIT_POINTS,
    mineLocations: [],
    subLocation: null,
    subPath: [],
    surfaced: false,
    systems: createSystems(),
  };
}

export function createEmptyRoster(): TeamRoster {
  return { captain: null, first_mate: null, radio_operator: null, engineer: null };
}

export interface CreateGameArgs {
  players: string[];
  usernames: Record<string, string>;
  teams: Record<Team, TeamRoster>;
  /** Defaults to the Bravo grid. */
  grid?: Grid;
  /** Defaults to the standard subsystem layout. */
  subsystems?: Subsystem[];
}

export function createGame(args: CreateGameArgs): Game {
  return {
    created: Date.now(),
    phase: PICK_PHASE,
    grid: args.grid ?? createBravoGrid(),
    subsystems: args.subsystems ?? createStandardSubsystems(),
    players: [...args.players],
    usernames: { ...args.usernames },
    teams: args.teams,
    notifications: [],
    winner: null,
    teamState: { red: createTeamState(), blue: createTeamState() },
  };
}

export function createLobby(code: string): Lobby {
  return {
    code,
    created: Date.now(),
    players: [],
    usernames: {},
    readied: [],
    teams: { red: createEmptyRoster(), blue: createEmptyRoster() },
    gameId: null,
  };
}
