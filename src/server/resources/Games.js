import { getDistance, getNewLocation, WATER_TILE } from '../../common/Grid';
import {
  BREAKDOWNS, COMMON, DIRECTION_MOVED, GRID, STARTED, SUB_LOCATION, SUB_PATH, SUBSYSTEMS, SYSTEM_IS_USED,
  SYSTEMS, TURN_INFO, TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { CHARGE, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, TORPEDO } from '../../common/System';
import { BLUE, RED } from '../../common/Team';
import { checkEngineOverload, fixCircuits } from '../../common/util/GameUtils';
import { assert, assertNotStarted, assertStarted, assertSystemReady } from './GameAssertions';
import { createGame } from './GameFactory';
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
    assert(!turnInfo.get(WAITING_FOR_FIRST_MATE), 'Cannot move. Waiting for First Mate');
    assert(!turnInfo.get(WAITING_FOR_ENGINEER), 'Cannot move. Waiting for Engineer');
    
    const grid = game.get(GRID);
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const nextLocation = getNewLocation(currentLocation, direction);
    const [x, y] = nextLocation.toArray();
    
    assert(x >= 0 && y >= 0 && x <= grid.size && y <= grid.get(0).size, 'Cannot move out of bounds');
    assert(!game.getIn([team, SUB_PATH]).contains(nextLocation), 'Cannot cross your path.');
    const tile = grid.getIn([x, y]);
    assert(!tile.equal(WATER_TILE), `Can only move into water tiles. ${tile}`);
    // TODO: Cannot move across mines
    
    return game
      .updateIn([team, TURN_INFO], turnInfo => turnInfo
        .set(DIRECTION_MOVED, direction)
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
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const distance = getDistance(currentLocation, location);
    assert(distance <= 4, `Torpedo target must within 4 squares (was ${distance})`);
    
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
    assert(game.getIn([team, TURN_INFO, WAITING_FOR_FIRST_MATE]), 'First Mate has already gone');
    
    // If system name is undefined, don't charge a system this turn
    if (systemName) {
      assert(game.hasIn([team, SYSTEMS, systemName]), `Cannot charge unknown system: ${systemName}`);
      game = game.updateIn([team, SYSTEMS, systemName], (system) =>
        system.set(CHARGE, Math.min(system.get(CHARGE) + 1, system.get(MAX_CHARGE))));
    }
    
    return game.setIn([team, TURN_INFO, WAITING_FOR_FIRST_MATE], false);
  })
);

/// Engineer ///

Games.trackBreakdown = (gameId, team, breakdownIndex) => {
  return Games.update(gameId, 'tracked_breakdown', {}, (game) => {
    const brokenSubsystem = game.getIn([SUBSYSTEMS, breakdownIndex]);
    assert(brokenSubsystem, `Invalid Breakdown: ${breakdownIndex}`);
    const directionMoved = game.getIn([team, TURN_INFO, DIRECTION_MOVED]);
    assert(
      brokenSubsystem.get(DIRECTION) === directionMoved,
      `Breakdown must be in direction moved. Expected ${directionMoved}, Actual ${brokenSubsystem.get(DIRECTION)}`
    );
    assert(!game.getIn([team, BREAKDOWNS]).includes(breakdownIndex), `Subsystem already broken: ${breakdownIndex}`);
    game = game.updateIn([team, BREAKDOWNS], breakdowns => breakdowns.push(breakdownIndex));
    
    game = fixCircuits(game, team);
    if (checkEngineOverload(game.get(SUBSYSTEMS), game.getIn([team, BREAKDOWNS]))) {
      game.setIn([team, BREAKDOWNS], Immutable.List());
      // TODO: Damage
    }
    
    return game.setIn([team, TURN_INFO, WAITING_FOR_ENGINEER], false);
  });
};

/// Radio Operator ///
// Has no moves

export default Games;
