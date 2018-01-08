import { getNewLocation, WATER_TILE } from '../../common/Grid';
import {
  CHARGE, COMMON, DRONE, GRID, MAX_CHARGE, MINE, SILENT, SONAR, STARTED, SUB_LOCATION, SUB_PATH, SYSTEM_IS_USED,
  SYSTEMS, TORPEDO, TURN_INFO, TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { BLUE, RED } from '../../common/Team';
import { createGame } from './GameFactory';
import { GameStateError } from './GameStateError';
import { assertNotStarted, assertStarted, assertSystemReady } from '../../common/util/GameUtils';
import Resource from './Resource';

// TODO: Unit test all of this

const Games = new Resource('game', 'game', createGame, false);

// TODO: Surfacing

/// Captain ///

Games.setStartLocation = (gameId, team, position) => (
  Games.update(gameId, 'start_location_set', {}, (game) => {
    assertNotStarted(game);
    game = game.setIn([team, SUB_LOCATION], position);
    if (game.getIn([RED, SUB_LOCATION]) && game.getIn([BLUE, SUB_LOCATION])) {
      game = game.setIn([COMMON, STARTED], true);
      Games.publish(game, 'started');
    }
    return game;
  })
);

Games.headInDirection = (gameId, team, direction) => (
  Games.update(gameId, 'headed_in_direction', {}, (game) => {
    assertStarted(game);
    
    const turnInfo = game.getIn([team, TURN_INFO]);
    if (turnInfo.get(WAITING_FOR_FIRST_MATE) || turnInfo.get(WAITING_FOR_ENGINEER)) { // TODO: Constants
      throw new GameStateError('Cannot move: ' + JSON.stringify(turnInfo));
    }
    
    const grid = game.get(GRID);
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const nextLocation = getNewLocation(currentLocation, direction);
    const [x, y] = nextLocation.toArray();
    
    if (x < 0 || y < 0 || x > grid.size || y > grid.get(0).size) {
      throw new GameStateError('Cannot move out of bounds');
    }
    
    if (game.getIn([team, SUB_PATH]).contains(nextLocation)) {
      throw new GameStateError('Cannot cross path');
    }
    
    const tile = grid.getIn([x, y]);
    if (!tile.equal(WATER_TILE)) {
      throw new GameStateError(`Can only move into water tiles. ${tile}`);
    }
    
    return game
      .updateIn([team, TURN_INFO], turnInfo => turnInfo
        .set(WAITING_FOR_ENGINEER, true)
        .set(WAITING_FOR_FIRST_MATE, true)
        .set(SYSTEM_IS_USED, false)
        .update(TURN_NUMBER, n => n + 1))
      .updateIn([team, SUB_PATH], path => path.push(currentLocation))
      .setIn([team, SUB_LOCATION], nextLocation);
  })
);

Games.fireTorpedo = (gameId, team, location) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assertSystemReady(TORPEDO);
    // TODO: Validate location
    // TODO: Torpedo
    game = game.setIn([team, SYSTEMS, TORPEDO, CHARGE], 0);
    return game;
  })
};

Games.dropMine = (gameId, team, location) => {
  return Games.update(gameId, 'dropped_mine', {}, (game) => {
    assertSystemReady(MINE);
    // TODO: Mine
    game = game.setIn([team, SYSTEMS, MINE, CHARGE], 0);
    return game;
  })
};

Games.useSonar = (gameId, team) => {
  return Games.update(gameId, 'used_sonar', {}, (game) => {
    assertSystemReady(SONAR);
    // TODO: Sonar
    game = game.setIn([team, SYSTEMS, SONAR, CHARGE], 0);
    return game;
  })
};

Games.useDrone = (gameId, team) => {
  return Games.update(gameId, 'used_drone', {}, (game) => {
    assertSystemReady(DRONE);
    // TODO: Drone
    game = game.setIn([team, SYSTEMS, DRONE, CHARGE], 0);
    return game;
  })
};

Games.goSilent = (gameId, team) => {
  return Games.update(gameId, 'went_silent', {}, (game) => {
    assertSystemReady(SILENT);
    // TODO: Silent
    game = game.setIn([team, SYSTEMS, SILENT, CHARGE], 0);
    return game;
  })
};

// TODO: Start Surface

/// First Mate ///

Games.chargeSystem = (gameId, team, systemName) => (
  Games.update(gameId, 'charged_system', {}, (game) => {
    assertStarted(game);
    if (!game.getIn([team, TURN_INFO, WAITING_FOR_FIRST_MATE])) {
      throw new GameStateError('First Mate has already gone');
    }
    
    if (systemName) {
      if (!game.hasIn([team, SYSTEMS, systemName])) {
        throw new GameStateError(`Cannot charge unknown system: ${systemName}`);
      }
      game = game.updateIn([team, SYSTEMS, systemName], (system) =>
        system.set(CHARGE, Math.min(system.get(CHARGE) + 1, system.get(MAX_CHARGE))));
    }
    
    game = game.setIn([team, TURN_INFO, WAITING_FOR_FIRST_MATE], false);
    
    return game
  })
);

/// Engineer ///

Games.trackBreakdown = (gameId, team, breakdown) => {
  return Games.update(gameId, 'tracked_breakdown', {}, (game) => {
    // TODO: Check valid breakdown
    // TODO: Actually mark breakdowns
    return game.setIn([team, TURN_INFO, WAITING_FOR_ENGINEER], false);
  });
};

/// Radio Operator ///
// Has no moves

export default Games;
