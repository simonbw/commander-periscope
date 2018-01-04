import PubSub from 'pubsub-js';
import { COMMON, ID, TEAMS } from '../../common/StateFields';
import { CHARGE_SYSTEM, HEAD_IN_DIRECTION } from '../../common/Messages';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';
import Games from '../data/Games';
import { getDataForUser, getPlayerPosition } from '../data/GameUtils';

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
  const handlers = {};
  // TODO: Separate out handlers by role
  
  const team = position && position.team;
  const role = position && position.role;
  
  switch (role) {
    case CAPTAIN:
      handlers[HEAD_IN_DIRECTION] = ({ systemName }) => {
        Games.headInDirection(gameId, team, systemName);
      };
      break;
    case FIRST_MATE:
      handlers[CHARGE_SYSTEM] = ({ systemName }) => {
        Games.chargeSystem(gameId, team, systemName);
      };
      break;
    case RADIO_OPERATOR:
    case ENGINEER:
      break;
    default:
      log(`unknown role: ${role}`);
  }
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, handler);
  });
}