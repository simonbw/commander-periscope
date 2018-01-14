import Immutable from 'immutable/dist/immutable';
import { LAND_TILE } from '../src/common/Grid';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../src/common/Role';
import { GRID, PLAYERS, READIED, TEAMS, USERNAMES } from '../src/common/StateFields';
import { BLUE, RED } from '../src/common/Team';
import { createGame, createGrid } from '../src/server/resources/GameFactory';

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

// Create a game with players = ['p1',...] and usernames ['player1'...]
export function mockGame(gameId = 'gameId') {
  const lobby = mockLobby();
  return createGame(gameId, {
    [PLAYERS]: lobby.get(PLAYERS),
    [USERNAMES]: lobby.get(USERNAMES),
    [TEAMS]: lobby.get(TEAMS)
  }).set(GRID, mockGrid());
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