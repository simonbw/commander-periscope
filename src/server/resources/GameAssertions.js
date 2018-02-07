/**
 * Assertions to verify the game is in a state where an action can be made.
 */

import { PHASE, SYSTEMS } from '../../common/fields/GameFields';
import { WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE } from '../../common/fields/TurnInfoFields';
import { MAIN_PHASE } from '../../common/GamePhase';
import { WATER_TILE } from '../../common/Grid';
import { TURN_INFO} from '../../common/fields/GameFields';
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

export function assertNotStarted(game) {
  assert(game.get(PHASE) < MAIN_PHASE, `Expected not start. Phases is ${game.get(PHASE)}`);
}

export function assertMainPhase(game) {
  assert(game.get(PHASE) === MAIN_PHASE, `Expected MAIN_PHASE, got ${game.get(PHASE)}`);
}

export function assertValidStartLocation(location, grid) {
  assert(grid.getIn(location) === WATER_TILE, 'Must start on water tile');
}

export function assertCanMove(game, team) {
  assertMainPhase(game);
  
  const turnInfo = game.getIn([team, TURN_INFO]);
  assert(!turnInfo.get(WAITING_FOR_FIRST_MATE), 'Cannot move. Waiting for First Mate');
  assert(!turnInfo.get(WAITING_FOR_ENGINEER), 'Cannot move. Waiting for Engineer');
}

export function assertCanMoveTo(location, grid, subPath, mineLocations) {
  const [x, y] = location.toArray();
  assert(x >= 0 && y >= 0 && x <= grid.size && y <= grid.get(0).size, 'Cannot move out of bounds');
  assert(!subPath.contains(location), 'Cannot cross your path.');
  assert(!mineLocations.includes(location), `Cannot move across your mines`);
  assert(grid.getIn([x, y]) === WATER_TILE, `Can only move into water tiles. ${grid.getIn([x, y])}`);
}

export function assertSystemReady(game, team, systemName) {
  assertMainPhase(game);
  
  if (!canUseSystem(game, team, systemName)) {
    const system = game.getIn([team, SYSTEMS, systemName]);
    assert(system.get(CHARGE) === system.get(MAX_CHARGE), 'System must be charged');
    // otherwise it's broken
    throw new GameStateError('System is broken');
  }
}