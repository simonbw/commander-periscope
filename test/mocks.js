import { createGrid, LAND_TILE } from '../src/common/Grid';
import { ALL_ROLES, CAPTAIN } from '../src/common/Role';
import { GRID } from '../src/common/StateFields';
import { BLUE, BOTH_TEAMS, RED } from '../src/common/Team';
import { createGame } from '../src/server/data/GameFactory';

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

export function mockGame(gameId = 'gameId') {
  const players = [];
  const usernames = {};
  const teams = {
    [RED]: {},
    [BLUE]: {}
  };
  for (let i = 0; i < 8; i++) {
    const userId = `userId${i}`;
    players.push(userId);
    usernames[userId] = `username${i}`;
    teams[BOTH_TEAMS[Math.floor(i / 4)]][ALL_ROLES[i % 4]] = userId;
  }
  return createGame(gameId, { players, usernames, teams }).set(GRID, mockGrid());
}