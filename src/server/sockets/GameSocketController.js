import PubSub from 'pubsub-js';
import Games from '../data/Games';
import { getDataForUser, getPlayerPosition } from '../data/GameUtils';

/**
 * Gets the userId.
 */
export default () => (socket, next) => {
  socket.on('join_game', ({ gameId }, onError) => joinGame(socket, gameId, onError));
  next();
};

const joinGame = (socket, gameId, onError) => {
  if (socket.joiningGame || socket.gameId) {
    throw new Error('Already in a game. Cannot join new lobby');
  }
  
  console.log('joining game');
  
  socket.joiningGame = true;
  return Games.get(gameId)
    .then((game) => {
      socket.joiningGame = false;
      socket.gameId = game.get('id');
      
      const position = getPlayerPosition(game.getIn(['common', 'teams']));
      const pubsubToken = attachMessageHandlers(socket, game.get('id'));
      listenToSocketMessages(socket, game.get('id'), pubsubToken, position);
      
      socket.emit('action', {
        type: 'game_joined',
        game: getDataForUser(game, socket.userId)
      });
    })
    .catch((e) => { // Could not load game
      socket.joiningGame = false;
      onError(e); // TODO: Better error handling
    });
};

const attachMessageHandlers = (socket, gameId, position) => {
  return PubSub.subscribe(
    Games.getPubSubTopic(gameId),
    (message, data) => {
      const eventName = message.split('.').pop();
      const actionType = `custom_lobby_${eventName}`;
      
      // TODO: Real message handlers
      
      socket.emit('action', {
        type: actionType,
        ...data
      });
    }
  );
};

const listenToSocketMessages = (socket, gameId, pubsubToken) => {
  const handlers = {};
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, handler);
  });
};