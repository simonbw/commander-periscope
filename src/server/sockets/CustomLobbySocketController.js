import PubSub from 'pubsub-js';
import { wait } from '../../common/util/AsyncUtil';
import {
  CUSTOM_LOBBY_JOINED_MESSAGE,
  CUSTOM_LOBBY_READY_MESSAGE,
  CUSTOM_LOBBY_SELECT_ROLE_MESSAGE,
  CUSTOM_LOBBY_SET_USERNAME_MESSAGE,
  CUSTOM_LOBBY_UNREADY_MESSAGE,
  JOIN_CUSTOM_LOBBY_MESSAGE,
  LEAVE_CUSTOM_LOBBY_MESSAGE
} from '../../common/Messages';
import { ID } from '../../common/StateFields';
import CustomLobby from '../resources/CustomLobbies';

const log = require('debug')('commander-periscope:server');

/**
 * Gets the userId
 */
export default () => (socket, next) => {
  let joiningCustomLobby = false;
  socket.on(JOIN_CUSTOM_LOBBY_MESSAGE, async ({ lobbyId, username }) => {
    if (joiningCustomLobby) {
      throw new Error('Already joining a lobby. Cannot join new lobby');
    } else if (socket.lobbyId) {
      throw new Error('Already in a lobby. Cannot join new lobby');
    }
    
    if (lobbyId) {
      log(`${socket.userId} joining custom lobby ${lobbyId}`);
    } else {
      log(`${socket.userId} creating custom lobby`);
    }
    
    joiningCustomLobby = true;
    
    if (process.env.NODE_ENV === 'dev') {
      await wait(1000); // artificial delay in dev
    }
    
    const lobby = await CustomLobby.addPlayer(lobbyId, socket.userId, username);
    joiningCustomLobby = false;
    socket.lobbyId = lobby.get(ID);
    
    const pubsubToken = attachPubsubHandlers(socket, lobby.get(ID));
    listenToSocketMessages(socket, lobby.get(ID), pubsubToken);
    
    socket.emit('action', {
      type: CUSTOM_LOBBY_JOINED_MESSAGE,
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
  handlers[CUSTOM_LOBBY_SELECT_ROLE_MESSAGE] = ({ role, team }) => {
    CustomLobby.selectRole(lobbyId, socket.userId, team, role);
  };
  
  handlers[CUSTOM_LOBBY_READY_MESSAGE] = () => {
    CustomLobby.ready(lobbyId, socket.userId);
  };
  
  handlers[CUSTOM_LOBBY_UNREADY_MESSAGE] = () => {
    CustomLobby.unready(lobbyId, socket.userId);
  };
  
  handlers[CUSTOM_LOBBY_SET_USERNAME_MESSAGE] = ({ username }) => {
    CustomLobby.setUsername(lobbyId, socket.userId, username);
  };
  
  handlers[LEAVE_CUSTOM_LOBBY_MESSAGE] = () => {
    socket.lobbyId = null;
    PubSub.unsubscribe(pubsubToken);
    Object.entries(handlers).forEach(([message, handler]) => {
      socket.removeListener(message, handler);
    });
    CustomLobby.removePlayer(lobbyId, socket.userId);
  };
  
  handlers['disconnect'] = () => handlers[LEAVE_CUSTOM_LOBBY_MESSAGE];
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, handler);
  });
};