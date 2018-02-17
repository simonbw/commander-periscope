import Immutable from 'immutable/dist/immutable';
import Random from 'random-js';
import { PLAYERS, TEAMS, USERNAMES } from '../src/common/fields/CommonFields';
import { GRID, SYSTEMS } from '../src/common/fields/GameFields';
import { READIED } from '../src/common/fields/LobbyFields';
import { CONNECTED, GAME, LOBBY, USER_ID } from '../src/common/fields/StateFields';
import { EAST, NORTH, SOUTH, WEST } from '../src/common/models/Direction';
import { DIRECT_HIT, INDIRECT_HIT, MISS } from '../src/common/models/Explosion';
import {
  createDetonateMineNotification, createDroneNotification, createDropMineNotification, createMoveNotification,
  createSilentNotification, createSonarNotification, createSurfaceNotification, createTorpedoNotification,
  NOTIFICATION_ID
} from '../src/common/models/Notifications';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../src/common/models/Role';
import { BLUE, RED } from '../src/common/models/Team';
import { generateSonarResult } from '../src/common/util/GameUtils';
import { createGame } from '../src/server/factories/GameFactory';
import { createBravoGrid } from '../src/server/factories/GridFactory';
import { transformGameForUser } from '../src/server/transforms/GameTransform';

export function mockGrid() {
  return createBravoGrid();
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
  return transformGameForUser(game, userId);
}

export function mockAppState(userId = 'userId') {
  return Immutable.Map({
    [CONNECTED]: false,
    [LOBBY]: null,
    [GAME]: null,
    [USER_ID]: userId,
  });
}

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

const r = Random();

function randomLocation() {
  return Immutable.List([r.integer(0, 14), r.integer(0, 14)]);
}

const notificationCreators = [
  () => createDetonateMineNotification(BLUE, randomLocation(), r.pick([DIRECT_HIT, INDIRECT_HIT, MISS])),
  () => createDroneNotification(RED, r.integer(0, 8), r.bool(0.5)),
  () => createDropMineNotification(BLUE, randomLocation()),
  () => createMoveNotification(RED, EAST),
  () => createMoveNotification(RED, NORTH),
  () => createMoveNotification(RED, SOUTH),
  () => createMoveNotification(RED, WEST),
  () => createSilentNotification(RED, randomLocation()),
  () => createSonarNotification(RED, generateSonarResult(randomLocation())),
  () => createSurfaceNotification(RED, r.integer(0, 8)),
  () => createTorpedoNotification(RED, randomLocation(), r.pick([DIRECT_HIT, INDIRECT_HIT, MISS])),
];

let lastId = 1;

export function mockNotification() {
  return r.pick(notificationCreators)().set(NOTIFICATION_ID, lastId++)
}