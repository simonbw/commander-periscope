import { getNewLocation, WATER_TILE } from '../../common/Grid';
import {
  CHARGE, COMMON, DRONE, GRID, MAX_CHARGE, MINE, SILENT, SONAR, STARTED, SUB_LOCATIONS, SUB_PATHS, SYSTEM_IS_USED,
  SYSTEMS,
  TORPEDO,
  TURN_INFO,
  TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { createGame } from './GameFactory';
import { GameStateError } from './GameStateError';
import { assertNotStarted, assertStarted, assertSystemReady } from './GameUtils';
import Resource from './Resource';

// TODO: Unit test all of this

const Games = new Resource('game', 'game', createGame, false);

// TODO: Surfacing

/// Captain ///

Games.setStartLocation = (gameId, team, position) => (
  Games.update(gameId, 'start_location_set', {}, (game) => {
    assertNotStarted(game);
    game = game.setIn([SUB_LOCATIONS, team], position);
    if (game.get(SUB_LOCATIONS).every((location) => location)) {
      game = game.setIn([COMMON, STARTED], true);
      Games.publish(game, 'started');
    }
    return game;
  })
);

Games.headInDirection = (gameId, team, direction) => (
  Games.update(gameId, 'headed_in_direction', {}, (game) => {
    assertStarted(game);
    
    const turnInfo = game.getIn([TURN_INFO, team]);
    if (turnInfo.get(WAITING_FOR_FIRST_MATE) || turnInfo.get(WAITING_FOR_ENGINEER)) { // TODO: Constants
      throw new GameStateError('Cannot move: ' + JSON.stringify(turnInfo));
    }
    
    const currentLocation = game.getIn([SUB_LOCATIONS, team]);
    const nextLocation = getNewLocation(currentLocation, direction);
    const x = nextLocation.get(0);
    const y = nextLocation.get(1);
    
    if (x < 0 || y < 0 || x > game.get(GRID).size || y > game.get(GRID).get(0).size) {
      throw new GameStateError('Cannot move out of bounds');
    }
    
    if (game.getIn([SUB_PATHS, team]).contains(nextLocation)) {
      throw new GameStateError('Cannot cross path');
    }
    
    const tile = game.getIn([GRID, x, y]);
    if (!tile.equal(WATER_TILE)) {
      throw new GameStateError(`Can only move into water tiles. ${tile}`);
    }
    
    return game
      .updateIn([TURN_INFO, team], turnInfo => turnInfo
        .set(WAITING_FOR_ENGINEER, true)
        .set(WAITING_FOR_FIRST_MATE, true)
        .set(SYSTEM_IS_USED, false)
        .update(TURN_NUMBER, n => n + 1))
      .updateIn([SUB_PATHS, team], paths => paths.push(currentLocation))
      .setIn([SUB_LOCATIONS, team], nextLocation);
  })
);

Games.fireTorpedo = (gameId, team, location) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assertSystemReady(TORPEDO);
    // TODO: Validate location
    // TODO: Torpedo
    return game;
  })
};

Games.dropMine = (gameId, team, location) => {
  return Games.update(gameId, 'dropped_mine', {}, (game) => {
    assertSystemReady(MINE);
    // TODO: Mine
    return game;
  })
};

Games.useSonar = (gameId, team) => {
  return Games.update(gameId, 'used_sonar', {}, (game) => {
    assertSystemReady(SONAR);
    // TODO: Sonar
    return game;
  })
};

Games.useDrone = (gameId, team) => {
  return Games.update(gameId, 'used_drone', {}, (game) => {
    assertSystemReady(DRONE);
    // TODO: Dron
    return game;
  })
};

Games.goSilent = (gameId, team) => {
  return Games.update(gameId, 'went_silent', {}, (game) => {
    assertSystemReady(SILENT);
    // TODO: Silent
    return game;
  })
};

// TODO: Start Surface

/// First Mate ///

Games.chargeSystem = (gameId, team, systemName) => (
  Games.update(gameId, 'charged_system', {}, (game) => {
    assertStarted(game);
    if (!game.getIn([TURN_INFO, team, WAITING_FOR_FIRST_MATE])) {
      throw new GameStateError('First Mate has already gone');
    }
    
    return game
      .updateIn([SYSTEMS, team, systemName], (system) =>
        system.set(CHARGE, Math.min(system.get(CHARGE) + 1, system.get(MAX_CHARGE))))
      .setIn([TURN_INFO, team, WAITING_FOR_FIRST_MATE], false);
  })
);

/// Engineer ///

Games.trackBreakdown = (gameId, team, breakdown) => {
  return Games.update(gameId, 'tracked_breakdown', {}, (game) => {
    // TODO: Check valid breakdown
    // TODO: Actually mark breakdowns
    return game.setIn([TURN_INFO, team, WAITING_FOR_ENGINEER], false);
  });
};

/// Radio Operator ///
// Has no moves

export default Games;
