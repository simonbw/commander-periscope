// Story fixtures, ported from the old test/mocks.js (Immutable) to plain data.
import { EAST, NORTH, SOUTH, WEST } from "../shared/direction";
import { DIRECT_HIT, INDIRECT_HIT, MISS } from "../shared/explosion";
import { generateSonarResult } from "../shared/gameUtils";
import {
  createDetonateMineNotification,
  createDroneNotification,
  createDropMineNotification,
  createMoveNotification,
  createSilentNotification,
  createSonarNotification,
  createSurfaceNotification,
  createTorpedoNotification,
} from "../shared/notifications";
import { CAPTAIN } from "../shared/role";
import { BLUE, RED } from "../shared/team";
import { mockGame } from "../shared/testMocks";
import { transformGameForPlayer, type PlayerGameView } from "../shared/transforms";
import type { HitResult, Location, NewNotification, Notification, Role, Team } from "../shared/types";

export function mockPath(): Location[] {
  return [
    [7, 8],
    [7, 9],
    [7, 10],
    [8, 10],
    [9, 10],
    [9, 9],
    [10, 9],
  ];
}

export function mockMines(): Location[] {
  return [
    [8, 8],
    [5, 10],
    [11, 10],
    [2, 1],
  ];
}

/** A fresh game (Bravo grid, pick phase) as seen by the player in `role` on `team`. */
export function mockPlayerView(role: Role = CAPTAIN, team: Team = RED): PlayerGameView {
  const game = mockGame();
  const playerId = game.teams[team][role];
  if (!playerId) {
    throw new Error(`No player for ${team} ${role}`);
  }
  return transformGameForPlayer(game, playerId);
}

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const randomLocation = (): Location => [randomInt(0, 14), randomInt(0, 14)];
const randomHitResult = (): HitResult => pick<HitResult>([DIRECT_HIT, INDIRECT_HIT, MISS]);

const notificationCreators: (() => NewNotification)[] = [
  () => createDetonateMineNotification(BLUE, randomLocation(), randomHitResult()),
  () => createDroneNotification(RED, randomInt(0, 8), Math.random() < 0.5),
  () => createDropMineNotification(BLUE, randomLocation()),
  () => createMoveNotification(RED, EAST),
  () => createMoveNotification(RED, NORTH),
  () => createMoveNotification(RED, SOUTH),
  () => createMoveNotification(RED, WEST),
  () => createSilentNotification(RED, randomLocation()),
  () => createSonarNotification(RED, generateSonarResult(randomLocation())),
  () => createSurfaceNotification(RED, randomInt(0, 8)),
  () => createTorpedoNotification(RED, randomLocation(), randomHitResult()),
];

let lastId = 1;

/** A random notification with a unique id. */
export function mockNotification(): Notification {
  return { ...pick(notificationCreators)(), id: lastId++ } as Notification;
}
