import Immutable from 'immutable';
import { getDirection, getManhattanDistance, getNewLocation, isAdjacent } from '../../common/Grid';
import {
  ACTION_ID,
  ACTION_TYPE,
  ACTIONS,
  BREAKDOWNS,
  COMMON,
  DIRECTION_MOVED,
  GRID,
  HIT_POINTS,
  MINE_LOCATIONS,
  PLAYERS,
  STARTED,
  SUB_LOCATION,
  SUB_PATH,
  SUBSYSTEMS,
  SYSTEM_IS_USED,
  SYSTEM_USED,
  SYSTEMS,
  TEAMS,
  TURN_INFO,
  TURN_NUMBER,
  USERNAMES,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE,
  WINNER
} from '../../common/StateFields';
import { CHARGE, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, TORPEDO } from '../../common/System';
import { BLUE, otherTeam, RED } from '../../common/Team';
import { checkEngineOverload, fixCircuits, getLastDirectionMoved } from '../../common/util/GameUtils';
import {
  assert,
  assertCanMove,
  assertCanMoveTo,
  assertNotStarted,
  assertStartedAndNotEnded,
  assertSystemReady
} from './GameAssertions';
import { createGame } from './GameFactory';
import Resource from './Resource';

const log = require('debug')('commander-periscope:server');

// TODO: Consider renaming this to GameDAO
const Games = new Resource('game', 'game', createGame, false);

Games.createFromLobby = (lobby, id = null) => {
  return Games.create(id, {
    [PLAYERS]: lobby.get(PLAYERS),
    [USERNAMES]: lobby.get(USERNAMES),
    [TEAMS]: lobby.get(TEAMS)
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
    assertCanMove(game, team);
    
    const grid = game.get(GRID);
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const nextLocation = getNewLocation(currentLocation, direction);
    
    assertCanMoveTo(nextLocation, grid, game.getIn([team, SUB_PATH]), game.getIn([team, MINE_LOCATIONS]));
    
    const action = Immutable.Map({
      [ACTION_TYPE]: 'move', // TODO: Constants
      [DIRECTION_MOVED]: direction,
      [ACTION_ID]: game.getIn([team, ACTIONS]).size
    });
    return game
      .updateIn([team, TURN_INFO], turnInfo => turnInfo
        .set(WAITING_FOR_ENGINEER, true)
        .set(WAITING_FOR_FIRST_MATE, true)
        .set(SYSTEM_IS_USED, false)
        .update(TURN_NUMBER, n => n + 1))
      .updateIn([team, SUB_PATH], path => path.push(currentLocation))
      .updateIn([team, ACTIONS], actions => actions.push(action))
      .setIn([team, SUB_LOCATION], nextLocation);
  })
);

Games.useSystem = (gameId, team, systemName, onUse) => {
  return Games.update(gameId, `used_${systemName}`, {}, async (game) => {
    assertSystemReady(game, team, systemName);
    game = await onUse(game);
    
    // TODO: Test Actions list
    const action = Immutable.Map({
      [ACTION_TYPE]: 'useSystem',//TODO: Constants
      [SYSTEM_USED]: systemName,
      [ACTION_ID]: game.getIn([team, ACTIONS]).size
    });
    return game
      .setIn([team, SYSTEMS, systemName, CHARGE], 0)
      .setIn([team, TURN_INFO, SYSTEM_IS_USED], true)
      .updateIn([team, ACTIONS], actions => actions.push(action));
  })
};

Games.fireTorpedo = (gameId, team, targetLocation) => {
  return Games.useSystem(gameId, team, TORPEDO, (game) => {
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    const distance = getManhattanDistance(currentLocation, targetLocation);
    assert(distance <= 4, `Torpedo target must within 4 squares (was ${distance})`);
    
    return explosion(game, team, targetLocation, currentLocation, opponentLocation);
  });
};

Games.dropMine = (gameId, team, location) => {
  return Games.useSystem(gameId, team, MINE, (game) => {
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    assert(!game.getIn([team, SUB_LOCATION]).equals(location), 'cannot drop a mine on self');
    assert(isAdjacent(location, currentLocation), 'must drop mine on adjacent location');
    assert(!game.getIn([team, SUB_PATH]).includes(location), 'cannot drop a mine on your path');
    assert(!game.getIn([team, MINE_LOCATIONS]).includes(location), 'cannot drop a mine on an existing mine');
    
    return game.updateIn([team, MINE_LOCATIONS], mineLocations => mineLocations.push(location));
  })
};

Games.useSonar = (gameId, team) => {
  return Games.useSystem(gameId, team, SONAR, (game) => game)
};

Games.useDrone = (gameId, team, sector) => {
  return Games.useSystem(gameId, team, DRONE, (game) => {
    assert(sector > 0 && sector <= 9, 'Must choose a sector 1 <= sector <= 9');
    return game;
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
        current = getNewLocation(current, direction);
        assertCanMoveTo(current, grid, game.getIn([team, SUB_PATH]), game.getIn([team, MINE_LOCATIONS]));
        game = game.updateIn([team, SUB_PATH], path => path.push(current));
      }
    }
    
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
    assertStartedAndNotEnded(game);
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
    assertStartedAndNotEnded(game);
    assert(game.getIn([team, TURN_INFO, WAITING_FOR_ENGINEER]), 'Engineer has already gone');
    
    const brokenSubsystem = game.getIn([SUBSYSTEMS, breakdownIndex]);
    assert(brokenSubsystem, `Invalid Breakdown: ${breakdownIndex}`);
    const directionMoved = getLastDirectionMoved(game.getIn([team, ACTIONS]));
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
  if (amount >= game.getIn([team, HIT_POINTS])) { // Game Over
    log('Game Over');
    return game
      .setIn([team, HIT_POINTS], 0)
      .setIn([COMMON, WINNER], otherTeam(team));
  }
  // not dead
  return game.updateIn([team, HIT_POINTS], hp => hp - amount);
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
