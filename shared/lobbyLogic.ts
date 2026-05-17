// Pure lobby-state transitions. These were the bodies of the CustomLobbies.*
// mutators in src/server/resources/CustomLobbies.js. Game creation when a
// lobby fills is the caller's responsibility (see convex/lobbies.ts) — call
// shouldStartGame after applying one of these.

import { produce } from "immer";
import { MAX_USERNAME_LENGTH } from "./constants";
import { GameStateError, ValidationError } from "./errors";
import { getTeamAndRole } from "./gameUtils";
import { ALL_ROLES } from "./role";
import { BOTH_TEAMS } from "./team";
import type { Lobby, Role, Team } from "./types";

/** True when every roster slot is filled and every seated player is ready. */
export function shouldStartGame(lobby: Lobby): boolean {
  if (lobby.gameId) {
    return false; // don't start a second game
  }
  return BOTH_TEAMS.every((team) =>
    ALL_ROLES.every((role) => {
      const playerId = lobby.teams[team][role];
      return playerId != null && lobby.readied.includes(playerId);
    }),
  );
}

export function addPlayer(
  lobby: Lobby,
  playerId: string,
  username?: string,
): Lobby {
  return produce(lobby, (draft) => {
    if (!draft.players.includes(playerId)) {
      draft.players.push(playerId);
    }
    if (username) {
      draft.usernames[playerId] = username;
    }
  });
}

export function removePlayer(lobby: Lobby, playerId: string): Lobby {
  return produce(lobby, (draft) => {
    draft.players = draft.players.filter((p) => p !== playerId);
    draft.readied = draft.readied.filter((p) => p !== playerId);
    delete draft.usernames[playerId];
    for (const team of BOTH_TEAMS) {
      for (const role of ALL_ROLES) {
        if (draft.teams[team][role] === playerId) {
          draft.teams[team][role] = null;
        }
      }
    }
  });
}

/** True when nobody is left in the lobby (caller should delete it). */
export function isLobbyEmpty(lobby: Lobby): boolean {
  return lobby.players.length === 0;
}

export function setUsername(
  lobby: Lobby,
  playerId: string,
  username: string,
): Lobby {
  if (username.length > MAX_USERNAME_LENGTH) {
    throw new ValidationError(
      `Usernames cannot be more than ${MAX_USERNAME_LENGTH} characters`,
    );
  }
  return produce(lobby, (draft) => {
    draft.usernames[playerId] = username;
  });
}

/** Pass null for both team and role to deselect the player's current slot. */
export function selectRole(
  lobby: Lobby,
  playerId: string,
  team: Team | null,
  role: Role | null,
): Lobby {
  return produce(lobby, (draft) => {
    if (team && role) {
      const current = draft.teams[team][role];
      if (current && current !== playerId) {
        throw new GameStateError(
          `That position is already taken ${team} ${role} by ${current}`,
        );
      }
    }

    const position = getTeamAndRole(draft.teams, playerId);
    if (position) {
      draft.teams[position.team][position.role] = null;
    }

    if (team && role) {
      draft.teams[team][role] = playerId;
    } else {
      // Deselecting a role also clears readiness.
      draft.readied = draft.readied.filter((p) => p !== playerId);
    }
  });
}

export function ready(lobby: Lobby, playerId: string): Lobby {
  return produce(lobby, (draft) => {
    if (!getTeamAndRole(draft.teams, playerId)) {
      throw new GameStateError("Cannot ready without a role");
    }
    if (!draft.readied.includes(playerId)) {
      draft.readied.push(playerId);
    }
  });
}

export function unready(lobby: Lobby, playerId: string): Lobby {
  return produce(lobby, (draft) => {
    draft.readied = draft.readied.filter((p) => p !== playerId);
  });
}
