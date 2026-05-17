// Per-player views of game and lobby state. A query in Convex runs with the
// caller's identity and returns one of these, so a player never receives the
// opponent's secret information. Ported from src/server/transforms.

import { GameStateError } from "./errors";
import { canUseSystem, getLastDirectionMoved, getTeamAndRole } from "./gameUtils";
import { ENDED_PHASE } from "./gamePhase";
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from "./role";
import { ALL_SYSTEMS } from "./system";
import { otherTeam } from "./team";
import type {
  Direction,
  Game,
  GamePhase,
  Grid,
  Location,
  Lobby,
  Notification,
  Role,
  Subsystem,
  SystemCharge,
  SystemName,
  Team,
  TeamAndRole,
  TeamRoster,
  TurnInfo,
} from "./types";

export interface PlayerGameView {
  phase: GamePhase;
  teams: Record<Team, TeamRoster>;
  usernames: Record<string, string>;
  role: Role;
  team: Team;
  hitPoints: number;
  surfaced: boolean;
  winner?: Team | null;

  // Captain
  grid?: Grid;
  subLocation?: Location | null;
  subPath?: Location[];
  turnInfo?: TurnInfo;
  mineLocations?: Location[];
  /** Captain: whether each system is currently usable. */
  systemStatuses?: Record<SystemName, boolean>;

  // First Mate
  systems?: Record<SystemName, SystemCharge>;
  waitingForFirstMate?: boolean;

  // Engineer
  subsystems?: Subsystem[];
  breakdowns?: number[];
  waitingForEngineer?: boolean;
  lastDirectionMoved?: Direction | null;

  // Radio Operator
  notifications?: Notification[];
}

export function transformGameForPlayer(
  game: Game,
  playerId: string,
): PlayerGameView {
  const position = getTeamAndRole(game.teams, playerId);
  if (!position) {
    throw new GameStateError(`Cannot get data for user: ${playerId}`);
  }
  const { team, role } = position;
  const teamState = game.teamState[team];

  const view: PlayerGameView = {
    phase: game.phase,
    teams: game.teams,
    usernames: game.usernames,
    role,
    team,
    hitPoints: teamState.hitPoints,
    surfaced: teamState.surfaced,
  };

  if (game.phase === ENDED_PHASE) {
    view.winner = game.winner;
  }

  switch (role) {
    case CAPTAIN: {
      const systemStatuses = {} as Record<SystemName, boolean>;
      for (const name of ALL_SYSTEMS) {
        systemStatuses[name] = canUseSystem(game, team, name);
      }
      view.grid = game.grid;
      view.subLocation = teamState.subLocation;
      view.subPath = teamState.subPath;
      view.turnInfo = teamState.turnInfo;
      view.mineLocations = teamState.mineLocations;
      view.systemStatuses = systemStatuses;
      break;
    }
    case FIRST_MATE:
      view.systems = teamState.systems;
      view.waitingForFirstMate = teamState.turnInfo.waitingForFirstMate;
      break;
    case ENGINEER:
      view.subsystems = game.subsystems;
      view.breakdowns = teamState.breakdowns;
      view.waitingForEngineer = teamState.turnInfo.waitingForEngineer;
      view.lastDirectionMoved = getLastDirectionMoved(game.notifications, team);
      break;
    case RADIO_OPERATOR: {
      const transformer = transformNotificationForRadioOperator(team);
      const visible = game.notifications
        .map(transformer)
        .filter((n): n is Notification => n != null);
      view.grid = game.grid;
      view.notifications = visible.slice(-5).reverse();
      break;
    }
  }

  return view;
}

/**
 * Redact a notification for the radio operator: enemy mine/silent locations
 * are hidden, and the player only sees the outcomes of their own systems.
 */
export function transformNotificationForRadioOperator(playerTeam: Team) {
  return (notification: Notification): Notification | null => {
    if (notification.team === otherTeam(playerTeam)) {
      switch (notification.kind) {
        case "MOVE":
        case "TORPEDO":
        case "DETONATE_MINE":
        case "SURFACE":
          return notification;
        case "DROP_MINE":
        case "SILENT":
          return { ...notification, location: undefined };
        default:
          return null;
      }
    } else {
      switch (notification.kind) {
        case "SONAR":
        case "DRONE":
        case "TORPEDO":
        case "DETONATE_MINE":
          return notification;
        default:
          return null;
      }
    }
  };
}

export interface LobbySlotView {
  isUser: boolean;
  isAvailable: boolean;
  isReady: boolean;
  username: string | undefined;
}

export interface PlayerLobbyView {
  code: string;
  gameId: string | null;
  teams: Record<Team, Record<Role, LobbySlotView>>;
  teamAndRole: TeamAndRole | undefined;
  isReady: boolean;
  username: string | undefined;
}

export function transformLobbyForPlayer(
  lobby: Lobby,
  userId: string,
): PlayerLobbyView {
  const teams = {} as Record<Team, Record<Role, LobbySlotView>>;
  for (const team of Object.keys(lobby.teams) as Team[]) {
    const roster = lobby.teams[team];
    const slots = {} as Record<Role, LobbySlotView>;
    for (const role of Object.keys(roster) as Role[]) {
      const playerId = roster[role];
      slots[role] = {
        isUser: playerId === userId,
        isAvailable: !playerId,
        isReady: playerId != null && lobby.readied.includes(playerId),
        username: playerId ? lobby.usernames[playerId] : undefined,
      };
    }
    teams[team] = slots;
  }

  return {
    code: lobby.code,
    gameId: lobby.gameId,
    teams,
    teamAndRole: getTeamAndRole(lobby.teams, userId),
    isReady: lobby.readied.includes(userId),
    username: lobby.usernames[userId],
  };
}
