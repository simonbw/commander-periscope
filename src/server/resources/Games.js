import { getDirection, getManhattanDistance, getNewLocation, isAdjacent, WATER_TILE } from '../../common/Grid';
import {
  BREAKDOWNS, COMMON, DIRECTION_MOVED, GRID, MINE_LOCATIONS, PLAYERS, STARTED, SUB_LOCATION, SUB_PATH,
  SUBSYSTEMS, SYSTEM_IS_USED, SYSTEMS, TEAMS, TURN_INFO, TURN_NUMBER, USERNAMES, WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../common/StateFields';
import { CHARGE, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, TORPEDO } from '../../common/System';
import { BLUE, otherTeam, RED } from '../../common/Team';
import { checkEngineOverload, fixCircuits } from '../../common/util/GameUtils';
import { assert, assertNotStarted, assertStarted, assertSystemReady } from './GameAssertions';
import { createGame } from './GameFactory';
import Resource from './Resource';

const log = require('debug')('commander-periscope:server');

// TODO: Consider renaming this to GameDAO
const Games = new Resource('game', 'game', createGame, false);

Games.createFromLobby = (lobby, id = null) => {
  return Games.create(id, {
    players: lobby.get(PLAYERS),
    usernames: lobby.get(USERNAMES),
    teams: lobby.get(TEAMS)
  });
};

/// Captain ///
// TODO: Surfacing

Games.setStartLocation = (gameId, team, location) => (
  Games.update(gameId, 'start_location_set', {}, (game) => {
    log('setting start location', team);
    assertNotStarted(game);
    game = game.setIn([team, SUB_LOCATION], location);
    if (game.getIn([RED, SUB_LOCATION]) && game.getIn([BLUE, SUB_LOCATION])) {
      game = game.setIn([COMMON, STARTED], true);
      Games.publish(game, 'started');
      log('starting game');
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
    assert(grid.getIn([x, y]) === WATER_TILE, `Can only move into water tiles. ${grid.getIn([x, y])}`);
    assert(!game.getIn([team, MINE_LOCATIONS]).includes(nextLocation), `Cannot move across your mines`);
    
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

Games.fireTorpedo = (gameId, team, targetLocation) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assertSystemReady(game, team, TORPEDO);
    
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    const distance = getManhattanDistance(currentLocation, targetLocation);
    assert(distance <= 4, `Torpedo target must within 4 squares (was ${distance})`);
    
    game = explosion(game, team, targetLocation, currentLocation, opponentLocation);
    return game.setIn([team, SYSTEMS, TORPEDO, CHARGE], 0);
  });
};

Games.dropMine = (gameId, team, location) => {
  return Games.update(gameId, 'dropped_mine', {}, (game) => {
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    assertSystemReady(game, team, MINE);
    assert(!game.getIn([team, SUB_LOCATION]).equals(location), 'cannot drop a mine on self');
    assert(isAdjacent(location, currentLocation), 'must drop mine on adjacent location');
    assert(!game.getIn([team, SUB_PATH]).includes(location), 'cannot drop a mine on your path');
    assert(!game.getIn([team, MINE_LOCATIONS]).includes(location), 'cannot drop a mine on an existing mine');
    
    return game
      .updateIn([team, MINE_LOCATIONS], mineLocations => mineLocations.push(location))
      .setIn([team, SYSTEMS, MINE, CHARGE], 0);
  })
};

Games.useSonar = (gameId, team) => {
  return Games.update(gameId, 'used_sonar', {}, (game) => {
    assertSystemReady(game, team, SONAR);
    
    // TODO: Sonar
    
    return game.setIn([team, SYSTEMS, SONAR, CHARGE], 0);
  })
};

Games.useDrone = (gameId, team, sector) => {
  return Games.update(gameId, 'used_drone', { sector }, (game) => {
    assertSystemReady(game, team, DRONE);
    assert(sector > 0 && sector <= 9, 'Must choose a sector 1 <= sector <= 9');
    
    // TODO: Is there actually anything to do here?
    
    return game.setIn([team, SYSTEMS, DRONE, CHARGE], 0);
  });
};

Games.goSilent = (gameId, team, destination) => (
  Games.update(gameId, 'went_silent', {}, (game) => {
    assertSystemReady(game, team, SILENT);
    
    const grid = game.get(GRID);
    const [x, y] = destination.toArray();
    assert(x >= 0 && y >= 0 && x <= grid.size && y <= grid.get(0).size, 'Cannot move out of bounds');
    
    const startLocation = game.getIn([team, SUB_LOCATION]);
    assert(getManhattanDistance(startLocation, destination) <= 3, 'Cannot move more than 3 spaces while silent');
    assert(startLocation.zip(destination).some(([c1, c2]) => c1 === c2), 'Must move in a straight line');
    
    if (!startLocation.equals(destination)) {
      const direction = getDirection(startLocation, destination);
      let current = startLocation;
      while (!current.equals(destination)) {
        assert(!game.getIn([team, SUB_PATH]).includes(current), 'Cannot move over your own path');
        assert(!game.getIn([team, MINE_LOCATIONS]).includes(current), 'Cannot move over your own mines');
        assert(grid.getIn(current) === WATER_TILE, 'Can only mover over water tiles');
        
        game = game.updateIn([team, SUB_PATH], path => path.push(current));
        current = getNewLocation(current, direction);
      }
    }
    
    // TODO: Make sure nothing in between
    // TODO: Make sure path not in between
    // TODO: Make sure mines not in between
    
    return game
      .setIn([team, SUB_LOCATION], destination)
      .setIn([team, SYSTEMS, SILENT, CHARGE], 0);
  })
);

// Not the same as drop mine. Can be used whenever you have a mine.
//       This could lead to bad things when trying to detonate two mines in quick succession
Games.detonateMine = (gameId, team, mineLocation) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assert(game.getIn([team, MINE_LOCATIONS]).includes(mineLocation), `You don't have a mine at: ${mineLocation}`);
    
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    
    game = explosion(game, team, mineLocation, currentLocation, opponentLocation);
    game = game.updateIn([team, MINE_LOCATIONS], (mines) => mines.filterNot(m => m.equals(mineLocation)));
    return game;
  });
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
    game = game.updateIn([team, BREAKDOWNS], breakdowns => breakdowns.add(breakdownIndex));
    
    game = fixCircuits(game, team);
    if (checkEngineOverload(game.get(SUBSYSTEMS), game.getIn([team, BREAKDOWNS]))) {
      game.setIn([team, BREAKDOWNS], Immutable.List());
      game = causeDamage(game, team, 1);
    }
    
    return game.setIn([team, TURN_INFO, WAITING_FOR_ENGINEER], false);
  });
};

/// Radio Operator ///
// Has no moves

function causeDamage(game, team, amount) {
  // TODO: causeDamage
  return game;
}

function explosion(game, team, explosionLocation, currentLocation, opponentLocation) {
  if (opponentLocation.equals(explosionLocation)) { // direct hit
    game = causeDamage(game, otherTeam(team), 2);
  } else if (isAdjacent(opponentLocation, explosionLocation)) { // indirect hit
    game = causeDamage(game, otherTeam(team), 1);
  }
  
  if (currentLocation.equals(explosionLocation)) { // direct hit
    game = causeDamage(game, team, 2);
  } else if (isAdjacent(currentLocation, explosionLocation)) { // indirect hit
    game = causeDamage(game, team, 1);
  }
  return game;
}

export default Games;
