// Core domain types for Commander Periscope.
// Ported from the Immutable.js-based model in src/common.

export type Team = "red" | "blue";
export type Role = "captain" | "first_mate" | "radio_operator" | "engineer";
export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
export type SystemName = "mine" | "torpedo" | "drone" | "sonar" | "silent";
export type SystemType = "weapons" | "comms" | "special" | "nuclear";

/** 0 = LOADING, 1 = PICK, 2 = MAIN, 3 = ENDED. See gamePhase.ts. */
export type GamePhase = 0 | 1 | 2 | 3;

/** A grid coordinate as [x, y]. [0,0] is the NW corner; +x East, +y South. */
export type Location = [number, number];

/** A grid is column-major: grid[x][y]. 0 = water, 1 = land. */
export type Grid = number[][];

/** role -> playerId (or null when the slot is open). */
export type TeamRoster = Record<Role, string | null>;

export interface Subsystem {
  id: number;
  systemType: SystemType;
  direction: Direction;
  circuit: number | null;
}

export interface SystemCharge {
  charge: number;
  maxCharge: number;
}

export interface TurnInfo {
  usedSystem: boolean;
  turnNumber: number;
  waitingForEngineer: boolean;
  waitingForFirstMate: boolean;
}

export interface TeamState {
  turnInfo: TurnInfo;
  breakdowns: number[];
  hitPoints: number;
  mineLocations: Location[];
  subLocation: Location | null;
  subPath: Location[];
  surfaced: boolean;
  systems: Record<SystemName, SystemCharge>;
}

/** MISS = 0, INDIRECT_HIT = 1, DIRECT_HIT = 2. See explosion.ts. */
export type HitResult = 0 | 1 | 2;

/** Two of the three keys are present: one truth, one lie. */
export interface SonarResult {
  row?: number;
  column?: number;
  sector?: number;
}

export type NotificationKind =
  | "MOVE"
  | "TORPEDO"
  | "DROP_MINE"
  | "DETONATE_MINE"
  | "SONAR"
  | "DRONE"
  | "SILENT"
  | "SURFACE";

interface BaseNotification {
  id: number;
  team: Team;
  kind: NotificationKind;
}

export interface MoveNotification extends BaseNotification {
  kind: "MOVE";
  direction: Direction;
}
export interface TorpedoNotification extends BaseNotification {
  kind: "TORPEDO";
  location: Location;
  hitResult: HitResult;
}
export interface DropMineNotification extends BaseNotification {
  kind: "DROP_MINE";
  /** Hidden from the opposing radio operator (see transforms.ts). */
  location?: Location;
}
export interface DetonateMineNotification extends BaseNotification {
  kind: "DETONATE_MINE";
  location: Location;
  hitResult: HitResult;
}
export interface SonarNotification extends BaseNotification {
  kind: "SONAR";
  sonarResult: SonarResult;
}
export interface DroneNotification extends BaseNotification {
  kind: "DRONE";
  sector: number;
  droneResult: boolean;
}
export interface SilentNotification extends BaseNotification {
  kind: "SILENT";
  /** Hidden from the opposing radio operator (see transforms.ts). */
  location?: Location;
}
export interface SurfaceNotification extends BaseNotification {
  kind: "SURFACE";
  sector: number;
}

export type Notification =
  | MoveNotification
  | TorpedoNotification
  | DropMineNotification
  | DetonateMineNotification
  | SonarNotification
  | DroneNotification
  | SilentNotification
  | SurfaceNotification;

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/** A notification before it is appended to a game (the id is assigned then). */
export type NewNotification = DistributiveOmit<Notification, "id">;

/**
 * Full server-side game state. Stored as a single Convex document.
 * `teams` is the role roster; `teamState` is the per-team game state
 * (previously stored under top-level `red`/`blue` keys).
 */
export interface Game {
  created: number;
  phase: GamePhase;
  grid: Grid;
  subsystems: Subsystem[];
  players: string[];
  usernames: Record<string, string>;
  teams: Record<Team, TeamRoster>;
  notifications: Notification[];
  winner: Team | null;
  teamState: Record<Team, TeamState>;
}

export interface Lobby {
  /** Short, shareable, human-readable code. Unique; indexed in Convex. */
  code: string;
  created: number;
  players: string[];
  usernames: Record<string, string>;
  readied: string[];
  teams: Record<Team, TeamRoster>;
  gameId: string | null;
}

export interface TeamAndRole {
  team: Team;
  role: Role;
}
