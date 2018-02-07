import Immutable from 'immutable/dist/immutable';
import { GRID, SYSTEMS } from '../src/common/fields/GameFields';
import { PLAYERS, READIED, TEAMS } from '../src/common/fields/LobbyFields';
import { LAND_TILE } from '../src/common/Grid';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../src/common/Role';
import { USERNAMES } from '../src/common/fields/LobbyFields';
import { BLUE, RED } from '../src/common/Team';
import { createGame, createGrid } from '../src/server/resources/GameFactory';
import { getDataForUser } from '../src/server/resources/UserGameTransform';

export function mockGrid() {
  return createGrid()
    .setIn([5, 2], LAND_TILE)
    .setIn([5, 3], LAND_TILE)
    .setIn([6, 3], LAND_TILE)
    .setIn([7, 3], LAND_TILE)
    .setIn([8, 3], LAND_TILE)
    .setIn([3, 9], LAND_TILE)
    .setIn([3, 10], LAND_TILE)
    .setIn([4, 10], LAND_TILE)
    .setIn([4, 11], LAND_TILE)
    .setIn([4, 12], LAND_TILE);
}

export function mockPath() {
  return Immutable.fromJS([
    [7, 8],
    [7, 9],
    [7, 10],
    [8, 10],
    [9, 10],
    [9, 9],
    [10, 9],
  ])
}

export function mockMines() {
  return Immutable.fromJS([
    [8, 8],
    [5, 10],
    [11, 10],
    [2, 1],
  ])
}

// Create a game with players = ['p1',...] and usernames ['player1'...]
export function mockGame(gameId = 'gameId') {
  const lobby = mockLobby();
  return createGame(gameId, {
    [PLAYERS]: lobby.get(PLAYERS),
    [USERNAMES]: lobby.get(USERNAMES),
    [TEAMS]: lobby.get(TEAMS)
  }).set(GRID, mockGrid());
}

export function mockSystems() {
  return mockGame().getIn([RED, SYSTEMS])
}

export function mockPlayerData(role = CAPTAIN, team = RED) {
  const game = mockGame();
  const userId = game.getIn([TEAMS, team, role]);
  return getDataForUser(game, userId);
}

// TODO: Mock subsystems so that we don't have random test behavior

export function mockLobby(id = 'lobbyId') {
  const players = Immutable.Range(1, 9).map(i => `p${i}`);
  const usernames = Immutable.Map(players.map((playerId, i) => [playerId, `player${i + 1}`]));
  return Immutable.fromJS({
    id,
    created: Date.now(),
    [PLAYERS]: players,
    [USERNAMES]: usernames,
    [READIED]: Immutable.Set(),
    [TEAMS]: {
      [RED]: {
        [CAPTAIN]: players.get(0),
        [FIRST_MATE]: players.get(1),
        [RADIO_OPERATOR]: players.get(2),
        [ENGINEER]: players.get(3),
      },
      [BLUE]: {
        [CAPTAIN]: players.get(4),
        [FIRST_MATE]: players.get(5),
        [RADIO_OPERATOR]: players.get(6),
        [ENGINEER]: players.get(7),
      }
    }
  })
}