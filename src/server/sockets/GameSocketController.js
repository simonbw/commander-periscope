import { List } from 'immutable';
import PubSub from 'pubsub-js';
import {
  CHARGE_SYSTEM, DETONATE_MINE, DROP_MINE, FIRE_TORPEDO, GO_SILENT, HEAD_IN_DIRECTION, SET_START_LOCATION,
  TRACK_BREAKDOWN, USE_DRONE, USE_SONAR
} from '../../common/Messages';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import { COMMON, ID, TEAMS } from '../../common/StateFields';
import { getPlayerPosition } from '../../common/util/GameUtils';
import Games from '../resources/Games';
import { getDataForUser } from '../resources/UserGameTransform';

const log = require('debug')('commander-periscope:server');

/**
 * Gets the userId.
 */
export default () => (socket, next) => {
  let joiningGame = false;
  socket.on('join_game', async ({ gameId }) => {
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
      const position = getPlayerPosition(game.getIn([COMMON, TEAMS]), playerId);
      const pubsubToken = attachPubsubHandlers(socket, game.get(ID), position);
      listenToSocketMessages(socket, game.get(ID), pubsubToken, position);
      
      socket.emit('action', {
        type: 'game_joined',
        game: getDataForUser(game, playerId)
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
      const eventName = message.split('.').pop();
      const actionType = `game_${eventName}`;
      
      // TODO: Real message handlers
      // Try to send less information over the wire.
      // We don't need to send everyone their full game state on every action.
      
      socket.emit('action', {
        type: 'game_update',
        game: getDataForUser(data.game, socket.userId)
      });
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
        [SET_START_LOCATION]: ({ location }) => Games.setStartLocation(gameId, team, List(location)),
        [HEAD_IN_DIRECTION]: ({ direction }) => Games.headInDirection(gameId, team, direction),
        [FIRE_TORPEDO]: ({ location }) => Games.fireTorpedo(gameId, team, List(location)),
        [DROP_MINE]: ({ location }) => Games.dropMine(gameId, team, List(location)),
        [DETONATE_MINE]: ({ location }) => Games.detonateMine(gameId, team, List(location)),
        [USE_SONAR]: ({}) => Games.useSonar(gameId, team),
        [USE_DRONE]: ({ sector }) => Games.useDrone(gameId, team, sector),
        [GO_SILENT]: ({ location }) => Games.goSilent(gameId, team, List(location)),
      };
    case FIRST_MATE:
      return {
        [CHARGE_SYSTEM]: ({ systemName }) => Games.chargeSystem(gameId, team, systemName),
      };
    case ENGINEER:
      return {
        [TRACK_BREAKDOWN]: ({ breakdownIndex }) => Games.trackBreakdown(gameId, team, breakdownIndex),
      };
    case RADIO_OPERATOR:
      return {};
    default:
      throw new Error(`Cannot get handlers for unknown role: ${role}`);
  }
}
