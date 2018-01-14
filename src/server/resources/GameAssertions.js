/**
 * Assertions to verify the game is in a state where an action can be made.
 */

import { COMMON, STARTED, SYSTEMS } from '../../common/StateFields';
import { CHARGE, MAX_CHARGE } from '../../common/System';
import { canUseSystem } from '../../common/util/GameUtils';

export class GameStateError extends Error {
  // TODO: https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
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
  if (!canUseSystem(game, team, systemName)) {
    const system = game.getIn([team, SYSTEMS, systemName]);
    assert(system.get(CHARGE) === system.get(MAX_CHARGE), 'System must be charged');
    // otherwise it's broken
    throw new GameStateError('System is broken');
  }
}