/**
 * Assertions to verify the game is in a state where an action can be made.
 */

import { COMMON, STARTED } from '../../common/StateFields';
import { canUseSystem } from '../../common/util/GameUtils';

export class GameStateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    Error.captureStackTrace(this, GameStateError);
  }
}

export function assert(assertion, message) {
  if (!assertion) {
    throw new GameStateError(message);
  }
}

export function assertStarted(game) {
  assert(game.getIn([COMMON, STARTED]), 'Game not yet started')
}

export function assertNotStarted(game) {
  assert(!game.getIn([COMMON, STARTED]), 'Game already started');
}

export function assertSystemReady(game, team, systemName) {
  assertStarted(game);
  assert(canUseSystem(game, team, systemName), 'System is not available');
  // TODO: better error messages
}