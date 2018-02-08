import Immutable from 'immutable';
import { getExplosionDamage, getExplosionResult } from '../../common/Explosion';
import {
  BREAKDOWNS, GRID, HIT_POINTS, MINE_LOCATIONS, NOTIFICATIONS, PHASE, SUB_LOCATION, SUB_PATH, SUBSYSTEMS, SURFACED,
  SYSTEMS, TURN_INFO, WINNER
} from '../../common/fields/GameFields';
import { PLAYERS, TEAMS, USERNAMES } from '../../common/fields/LobbyFields';
import {
  SYSTEM_IS_USED, TURN_NUMBER, WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE
} from '../../common/fields/TurnInfoFields';
import { ENDED_PHASE, MAIN_PHASE } from '../../common/GamePhase';
import {
  getDirection, getGridSize, getLocationFromDirection, getManhattanDistance, isAdjacent, tileToSector
} from '../../common/Grid';
import {
  createDetonateMineNotification, createDroneNotification, createDropMineNotification, createMoveNotification,
  createSilentNotification, createSonarNotification, createSurfaceNotification, createTorpedoNotification,
  notificationAdder
} from '../../common/Notifications';
import { CHARGE, DIRECTION, DRONE, MAX_CHARGE, MINE, SILENT, SONAR, TORPEDO } from '../../common/System';
import { BLUE, otherTeam, RED } from '../../common/Team';
import { sleep } from '../../common/util/AsyncUtil';
import {
  checkEngineOverload, fixCircuits, generateSonarResult, getLastDirectionMoved
} from '../../common/util/GameUtils';
import {
  assert, assertCanMove, assertCanMoveTo, assertMainPhase, assertNotStarted, assertSystemReady, assertValidStartLocation
} from './GameAssertions';
import { createGame } from './GameFactory';
import Resource from './Resource';

const log = require('debug')('commander-periscope:server');

const SURFACE_DURATION = 30 * 1000;

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
    assertValidStartLocation(location, game.get(GRID));
    game = game.setIn([team, SUB_LOCATION], location);
    // TODO: Don't allow starting on water
    if (game.getIn([RED, SUB_LOCATION]) && game.getIn([BLUE, SUB_LOCATION])) {
      game = game.set(PHASE, MAIN_PHASE);
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
    const nextLocation = getLocationFromDirection(currentLocation, direction);
    
    assertCanMoveTo(nextLocation, grid, game.getIn([team, SUB_PATH]), game.getIn([team, MINE_LOCATIONS]));
    return game
      .updateIn([team, TURN_INFO], turnInfo => turnInfo
        .set(WAITING_FOR_ENGINEER, true)
        .set(WAITING_FOR_FIRST_MATE, true)
        .set(SYSTEM_IS_USED, false)
        .update(TURN_NUMBER, n => n + 1))
      .updateIn([team, SUB_PATH], path => path.push(currentLocation))
      .update(NOTIFICATIONS, notificationAdder(createMoveNotification(team, direction)))
      .setIn([team, SUB_LOCATION], nextLocation);
  })
);

Games.useSystem = (gameId, team, systemName, onUse) => {
  return Games.update(gameId, `used_${systemName}`, {}, async (game) => {
    assertSystemReady(game, team, systemName);
    game = await onUse(game);
    return game
      .setIn([team, SYSTEMS, systemName, CHARGE], 0)
      .setIn([team, TURN_INFO, SYSTEM_IS_USED], true);
  })
};

Games.fireTorpedo = (gameId, team, targetLocation) => {
  return Games.useSystem(gameId, team, TORPEDO, (game) => {
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    const distance = getManhattanDistance(currentLocation, targetLocation);
    assert(distance <= 4, `Torpedo target must within 4 squares (was ${distance})`);
    const hitResult = getExplosionResult(targetLocation, opponentLocation);
    game = applyExplosion(game, team, targetLocation, currentLocation, opponentLocation);
    return game.update(NOTIFICATIONS, notificationAdder(createTorpedoNotification(team, targetLocation, hitResult)));
  });
};

Games.dropMine = (gameId, team, location) => {
  return Games.useSystem(gameId, team, MINE, (game) => {
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    assert(!game.getIn([team, SUB_LOCATION]).equals(location), 'cannot drop a mine on self');
    assert(isAdjacent(location, currentLocation), 'must drop mine on adjacent location');
    assert(!game.getIn([team, SUB_PATH]).includes(location), 'cannot drop a mine on your path');
    assert(!game.getIn([team, MINE_LOCATIONS]).includes(location), 'cannot drop a mine on an existing mine');
    
    return game
      .updateIn([team, MINE_LOCATIONS], mineLocations => mineLocations.push(location))
      .update(NOTIFICATIONS, notificationAdder(createDropMineNotification(team, location)));
  })
};

Games.useSonar = (gameId, team) => {
  return Games.useSystem(gameId, team, SONAR, (game) => {
    const sonarResult = generateSonarResult(game.getIn([otherTeam(team), SUB_LOCATION]));
    return game.update(NOTIFICATIONS, notificationAdder(createSonarNotification(team, sonarResult)));
  })
};

Games.useDrone = (gameId, team, sector) => {
  return Games.useSystem(gameId, team, DRONE, (game) => {
    assert(sector > 0 && sector <= 9, 'Must choose a sector 1 <= sector <= 9');
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    const gridSize = getGridSize(game.get(GRID));
    const result = tileToSector(opponentLocation, gridSize) === sector;
    return game.update(NOTIFICATIONS, notificationAdder(createDroneNotification(team, sector, result)));
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
        current = getLocationFromDirection(current, direction);
        assertCanMoveTo(current, grid, game.getIn([team, SUB_PATH]), game.getIn([team, MINE_LOCATIONS]));
        game = game.updateIn([team, SUB_PATH], path => path.push(current));
      }
    }
    
    return game
      .setIn([team, SUB_LOCATION], destination)
      .setIn([team, SYSTEMS, SILENT, CHARGE], 0)
      .update(NOTIFICATIONS, notificationAdder(createSilentNotification(team, destination)));
  })
);

// Not the same as drop mine. Can be used whenever you have a mine.
Games.detonateMine = (gameId, team, mineLocation) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assert(game.getIn([team, MINE_LOCATIONS]).includes(mineLocation), `You don't have a mine at: ${mineLocation}`);
    
    const currentLocation = game.getIn([team, SUB_LOCATION]);
    const opponentLocation = game.getIn([otherTeam(team), SUB_LOCATION]);
    
    game = applyExplosion(game, team, mineLocation, currentLocation, opponentLocation);
    const result = getExplosionResult(opponentLocation, mineLocation);
    return game
      .updateIn([team, MINE_LOCATIONS], (mines) => mines.filterNot(m => m.equals(mineLocation)))
      .update(NOTIFICATIONS, notificationAdder(createDetonateMineNotification(team, mineLocation, result)));
  });
};

Games.surface = async (gameId, team, duration = SURFACE_DURATION) => {
  await Games.update(gameId, 'surface_start', {}, (game) => {
    const sector = tileToSector(game.getIn([team, SUB_LOCATION]), getGridSize(game.get(GRID)));
    return game
      .setIn([team, SURFACED], true)
      .update(NOTIFICATIONS, notificationAdder(createSurfaceNotification(team, sector)))
  });
  
  await sleep(duration);
  
  await Games.update(gameId, 'surface_end', {}, (game) => {
    return game
      .setIn([team, SURFACED], false)
      .setIn([team, SUB_PATH], Immutable.List([]))
      .setIn([team, BREAKDOWNS], Immutable.List([]))
  });
};

/// First Mate ///

Games.chargeSystem = (gameId, team, systemName) => (
  Games.update(gameId, 'charged_system', {}, (game) => {
    assertMainPhase(game);
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
    assertMainPhase(game);
    assert(game.getIn([team, TURN_INFO, WAITING_FOR_ENGINEER]), 'Engineer has already gone');
    
    const brokenSubsystem = game.getIn([SUBSYSTEMS, breakdownIndex]);
    assert(brokenSubsystem, `Invalid Breakdown: ${breakdownIndex}`);
    const directionMoved = getLastDirectionMoved(game.get(NOTIFICATIONS), team);
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
      .set(PHASE, ENDED_PHASE)
      .set(WINNER, otherTeam(team));
  }
  // not dead
  return game.updateIn([team, HIT_POINTS], hp => hp - amount);
}

function applyExplosion(game, team, explosionLocation, currentLocation, opponentLocation) {
  game = causeDamage(game, otherTeam(team),
    getExplosionDamage(
      getExplosionResult(opponentLocation, explosionLocation)));
  
  game = causeDamage(game, team,
    getExplosionDamage(
      getExplosionResult(currentLocation, explosionLocation)));
  
  return game;
}

export default Games;
