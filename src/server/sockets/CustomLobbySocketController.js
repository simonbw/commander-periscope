import PubSub from 'pubsub-js';
import {
  CUSTOM_LOBBY_JOINED, CUSTOM_LOBBY_READY, CUSTOM_LOBBY_SELECT_ROLE, CUSTOM_LOBBY_SET_USERNAME,
  CUSTOM_LOBBY_UNREADY, JOIN_CUSTOM_LOBBY, LEAVE_CUSTOM_LOBBY
} from '../../common/Messages';
import { ID } from '../../common/StateFields';
import CustomLobby from '../resources/CustomLobbies';

const log = require('debug')('commander-periscope:server');

/**
 * Gets the userId
 */
export default () => (socket, next) => {
  let joiningCustomLobby = false;
  socket.on(JOIN_CUSTOM_LOBBY, async ({ lobbyId, username }) => {
    if (joiningCustomLobby || socket.lobbyId) {
      throw new Error('Already in a lobby. Cannot join new lobby');
    }
    if (lobbyId) {
      log(`${socket.userId} joining custom lobby ${lobbyId}`);
    } else {
      log(`${socket.userId} creating custom lobby`);
    }
    
    joiningCustomLobby = true;
    
    const lobby = await CustomLobby.addPlayer(lobbyId, socket.userId, username);
    joiningCustomLobby = false;
    socket.lobbyId = lobby.get(ID);
    
    const pubsubToken = attachPubsubHandlers(socket, lobby.get(ID));
    listenToSocketMessages(socket, lobby.get(ID), pubsubToken);
    
    socket.emit('action', {
      type: CUSTOM_LOBBY_JOINED,
      lobby
    });
  });
  
  next();
};

const attachPubsubHandlers = (socket, lobbyId) => {
  return PubSub.subscribe(
    CustomLobby.getPubSubTopic(lobbyId),
    (message, data) => {
      const eventName = message.split('.').pop();
      const actionType = `custom_lobby_${eventName}`; // TODO: Something better than this
      
      socket.emit('action', {
        type: actionType,
        ...data
      });
    }
  );
};

const listenToSocketMessages = (socket, lobbyId, pubsubToken) => {
  // TODO: Report errors in these handlers back to the client
  const handlers = {};
  handlers[CUSTOM_LOBBY_SELECT_ROLE] = ({ role, team }) => {
    CustomLobby.selectRole(lobbyId, socket.userId, team, role);
  };
  
  handlers[CUSTOM_LOBBY_READY] = () => {
    CustomLobby.ready(lobbyId, socket.userId);
  };
  
  handlers[CUSTOM_LOBBY_UNREADY] = () => {
    CustomLobby.unready(lobbyId, socket.userId);
  };
  
  handlers[CUSTOM_LOBBY_SET_USERNAME] = ({ username }) => {
    CustomLobby.setUsername(lobbyId, socket.userId, username);
  };
  
  handlers[LEAVE_CUSTOM_LOBBY] = () => {
    socket.lobbyId = null;
    PubSub.unsubscribe(pubsubToken);
    Object.entries(handlers).forEach(([message, handler]) => {
      socket.removeListener(message, handler);
    });
    CustomLobby.removePlayer(lobbyId, socket.userId);
  };
  
  handlers['disconnect'] = () => handlers[LEAVE_CUSTOM_LOBBY];
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, handler);
  });
};