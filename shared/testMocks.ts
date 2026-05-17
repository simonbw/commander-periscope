// Test fixtures, ported from test/mocks.js.
import { createGame } from "./gameFactory";
import { createBravoGrid } from "./grids";
import type { Game, Grid, Lobby } from "./types";

export function mockLobby(code = "lobbyId"): Lobby {
  const players = Array.from({ length: 8 }, (_, i) => `p${i + 1}`);
  const usernames: Record<string, string> = {};
  players.forEach((p, i) => {
    usernames[p] = `player${i + 1}`;
  });
  return {
    code,
    created: Date.now(),
    players,
    usernames,
    readied: [],
    teams: {
      red: {
        captain: players[0],
        first_mate: players[1],
        radio_operator: players[2],
        engineer: players[3],
      },
      blue: {
        captain: players[4],
        first_mate: players[5],
        radio_operator: players[6],
        engineer: players[7],
      },
    },
    gameId: null,
  };
}

export function mockGame(grid: Grid = createBravoGrid()): Game {
  const lobby = mockLobby();
  return createGame({
    players: lobby.players,
    usernames: lobby.usernames,
    teams: lobby.teams,
    grid,
  });
}
