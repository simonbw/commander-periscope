import { createGame } from './GameFactory';
import { GameStateError } from './GameStateError';
import { assertNotStarted, assertStarted, assertSystemReady } from './GameUtils';
import { getNewLocation, WATER_TILE } from '../../common/Grid';
import Resource from './Resource';

// TODO: Unit test all of this

const Games = new Resource('game', 'game', createGame, false);

// TODO: Surfacing

/// Captain ///

Games.setStartLocation = (gameId, team, position) => (
  Games.update(gameId, 'start_location_set', {}, (game) => {
    assertNotStarted(game);
    game = game.setIn(['subLocations', team], position);
    if (game.get('subLocations').every((location) => location)) {
      game = game.setIn(['common', 'started'], true);
      Games.publish(game, 'started');
    }
    return game;
  })
);

Games.headInDirection = (gameId, team, direction) => (
  Games.update(gameId, 'headed_in_direction', {}, (game) => {
    assertStarted(game);
    
    const turnInfo = game.getIn(['turnInfo', team]);
    if (turnInfo.get('waitingForFirstMate') || turnInfo.get('waitingForEngineer')) { // TODO: Constants
      throw new GameStateError('Cannot move: ' + JSON.stringify(turnInfo));
    }
    
    const currentLocation = game.getIn(['subLocations', team]);
    const nextLocation = getNewLocation(currentLocation, direction);
    const x = nextLocation.get(0);
    const y = nextLocation.get(1);
    
    if (x < 0 || y < 0 || x > game.get('grid').size || y > game.get('grid').get(0).size) {
      throw new GameStateError('Cannot move out of bounds');
    }
    
    if (game.getIn(['subPaths', team]).contains(nextLocation)) {
      throw new GameStateError('Cannot cross path');
    }
    
    const tile = game.getIn(['grid', x, y]);
    if (!tile.equal(WATER_TILE)) {
      throw new GameStateError(`Can only move into water tiles. ${tile}`);
    }
    
    return game
      .updateIn(['turnInfo', team], turnInfo => turnInfo
        .set('waitingForEngineer', true)
        .set('waitingForFirstMate', true)
        .set('usedSystem', false)
        .update('turnNumber', n => n + 1))
      .updateIn(['subPaths', team], paths => paths.push(currentLocation))
      .setIn(['subLocations', team], nextLocation);
  })
);

Games.fireTorpedo = (gameId, team, location) => {
  return Games.update(gameId, 'fired_torpedo', {}, (game) => {
    assertSystemReady('torpedo');
    // TODO: Validate location
    // TODO: Torpedo
    return game;
  })
};

Games.dropMine = (gameId, team, location) => {
  return Games.update(gameId, 'dropped_mine', {}, (game) => {
    assertSystemReady('mine');
    // TODO: Mine
    return game;
  })
};

Games.useSonar = (gameId, team) => {
  return Games.update(gameId, 'used_sonar', {}, (game) => {
    assertSystemReady('sonar');
    // TODO: Sonar
    return game;
  })
};

Games.useDrone = (gameId, team) => {
  return Games.update(gameId, 'used_drone', {}, (game) => {
    assertSystemReady('drone');
    // TODO: Dron
    return game;
  })
};

Games.goSilent = (gameId, team) => {
  return Games.update(gameId, 'went_silent', {}, (game) => {
    assertSystemReady('silent');
    // TODO: Silent
    return game;
  })
};

// TODO: Start Surface

/// First Mate ///

Games.chargeSystem = (gameId, team, systemName) => (
  Games.update(gameId, 'charged_system', {}, (game) => {
    assertStarted(game);
    if (!game.getIn(['turnInfo', team, 'waitingForFirstMate'])) {
      throw new GameStateError('First Mate has already gone');
    }
    
    return game
      .updateIn(['systems', team, systemName], (system) =>
        system.set('charge', Math.min(system.get('charge') + 1, system.get('max'))))
      .setIn(['turnInfo', team, 'waitingForFirstMate'], false);
  })
);

/// Engineer ///

Games.trackBreakdown = (gameId, team, breakdown) => {
  return Games.update(gameId, 'tracked_breakdown', {}, (game) => {
    // TODO: Check valid breakdown
    // TODO: Actually mark breakdowns
    return game.setIn(['turnInfo', team, 'waitingForEngineer'], false);
  });
};

/// Radio Operator ///
// Has no moves

export default Games;
