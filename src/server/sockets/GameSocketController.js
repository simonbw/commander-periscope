import Immutable, { List } from 'immutable';
import PubSub from 'pubsub-js';
import { ID, TEAMS } from '../../common/fields/CommonFields';
import {
  CHARGE_SYSTEM_MESSAGE, DETONATE_MINE_MESSAGE, DROP_MINE_MESSAGE, FIRE_TORPEDO_MESSAGE, GAME_JOINED_MESSAGE,
  GAME_UPDATED_MESSAGE, GO_SILENT_MESSAGE, HEAD_IN_DIRECTION_MESSAGE, JOIN_GAME_MESSAGE, SET_START_LOCATION_MESSAGE,
  SURFACE_MESSAGE, TRACK_BREAKDOWN_MESSAGE, USE_DRONE_MESSAGE, USE_SONAR_MESSAGE
} from '../../common/messages/GameMessages';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/models/Role';
import { getTeamAndRole } from '../../common/util/GameUtils';
import Games from '../resources/Games';
import { transformGameForUser } from '../transforms/GameTransform';

const log = require('debug')('commander-periscope:server');

/**
 * Gets the userId.
 */
export default () => (socket, next) => {
  let joiningGame = false;
  socket.on(JOIN_GAME_MESSAGE, async ({ gameId }) => {
    if (joiningGame || socket.gameId) {
      throw new Error(`${socket.userId} already in a game. Cannot join another game.`);
    }
    log(`${socket.userId} joining game ${gameId}`);
    
    joiningGame = true;
    try {
      const game = await Games.get(gameId);
      joiningGame = false;
      socket.gameId = game.get(ID);
      
      const playerId = socket.userId;
      const position = getTeamAndRole(game.get(TEAMS), playerId);
      const pubsubToken = attachPubsubHandlers(socket, game.get(ID), position);
      listenToSocketMessages(socket, game.get(ID), pubsubToken, position);
      
      socket.emit('action', {
        type: GAME_JOINED_MESSAGE,
        game: transformGameForUser(game, playerId)
      });
    } catch (e) { // Could not load game
      joiningGame = false;
      log(e); // TODO: Better error handling
    }
  });
  
  next();
};

function attachPubsubHandlers(socket, gameId, position) {
  return PubSub.subscribe(
    Games.getPubSubTopic(gameId),
    (message, data) => {
      // TODO: Real message handlers
      // Try to send less information over the wire.
      // We don't need to send everyone their full game state on every action.
      
      const game = transformGameForUser(data.game, socket.userId);
      // Only send update if data has changed
      if (!Immutable.is(game, socket.lastSentGame)) {
        socket.lastSentGame = game;
        socket.emit('action', {
          type: GAME_UPDATED_MESSAGE,
          game: game
        });
      }
      
    }
  );
}

function listenToSocketMessages(socket, gameId, pubsubToken, position) {
  const team = position && position.team;
  const role = position && position.role;
  
  const handlers = getRoleHandlers(role, team, gameId);
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, async (...args) => {
      try {
        await handler(...args);
      } catch (e) {
        // TODO: Report errors in handlers
        throw e;
      }
    });
  });
}

function getRoleHandlers(role, team, gameId) {
  switch (role) {
    case CAPTAIN:
      return {
        [SET_START_LOCATION_MESSAGE]: ({ location }) => Games.setStartLocation(gameId, team, List(location)),
        [HEAD_IN_DIRECTION_MESSAGE]: ({ direction }) => Games.headInDirection(gameId, team, direction),
        [FIRE_TORPEDO_MESSAGE]: ({ location }) => Games.fireTorpedo(gameId, team, List(location)),
        [DROP_MINE_MESSAGE]: ({ location }) => Games.dropMine(gameId, team, List(location)),
        [DETONATE_MINE_MESSAGE]: ({ location }) => Games.detonateMine(gameId, team, List(location)),
        [USE_SONAR_MESSAGE]: () => Games.useSonar(gameId, team),
        [USE_DRONE_MESSAGE]: ({ sector }) => Games.useDrone(gameId, team, sector),
        [GO_SILENT_MESSAGE]: ({ location }) => Games.goSilent(gameId, team, List(location)),
        [SURFACE_MESSAGE]: () => Games.surface(gameId, team),
      };
    case FIRST_MATE:
      return {
        [CHARGE_SYSTEM_MESSAGE]: ({ systemName }) => Games.chargeSystem(gameId, team, systemName),
      };
    case ENGINEER:
      return {
        [TRACK_BREAKDOWN_MESSAGE]: ({ breakdownIndex }) => Games.trackBreakdown(gameId, team, breakdownIndex),
      };
    case RADIO_OPERATOR:
      return {};
    default:
      throw new Error(`Cannot get handlers for unknown role: ${role}`);
  }
}
