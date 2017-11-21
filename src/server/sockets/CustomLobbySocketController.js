import PubSub from 'pubsub-js';
import CustomLobby from '../data/CustomLobbies';

/**
 * Gets the userId
 */
export default () => (socket, next) => {
  let joiningCustomLobby = false;
  
  socket.on('join_custom_lobby', ({ lobbyId, username }) => {
    if (joiningCustomLobby || socket.lobbyId) {
      throw new Error('Already in a lobby. Cannot join new lobby');
    }
    
    joiningCustomLobby = true;
    
    CustomLobby.addPlayer(lobbyId, socket.userId, username)
      .then((lobby) => {
        joiningCustomLobby = false;
        socket.lobbyId = lobby.get('id');
        
        const pubsubToken = attachMessageHandlers(socket, lobby.get('id'));
        listenToSocketMessages(socket, lobby.get('id'), pubsubToken);
        
        socket.emit('action', {
          type: 'custom_lobby_joined',
          lobby
        });
      });
  });
  
  next();
};

const attachMessageHandlers = (socket, lobbyId) => {
  return PubSub.subscribe(
    CustomLobby.getPubSubTopic(lobbyId),
    (message, data) => {
      const eventName = message.split('.').pop();
      const actionType = `custom_lobby_${eventName}`;
      
      socket.emit('action', {
        type: actionType,
        ...data
      });
    }
  );
};

const listenToSocketMessages = (socket, lobbyId, pubsubToken) => {
  const handlers = {};
  handlers['custom_lobby_select_role'] = ({ role, team }) => {
    CustomLobby.selectRole(lobbyId, socket.userId, team, role);
  };
  
  handlers['custom_lobby_ready'] = () => {
    CustomLobby.ready(lobbyId, socket.userId);
  };
  
  handlers['custom_lobby_unready'] = () => {
    CustomLobby.unready(lobbyId, socket.userId);
  };
  
  handlers['custom_lobby_set_username'] = ({ username }) => {
    CustomLobby.setUsername(lobbyId, socket.userId, username);
  };
  
  handlers['leave_custom_lobby'] = () => {
    socket.lobbyId = null;
    PubSub.unsubscribe(pubsubToken);
    Object.entries(handlers).forEach(([message, handler]) => {
      socket.off(message, handler);
    });
    CustomLobby.removePlayer(lobbyId, socket.userId);
  };
  
  handlers['disconnect'] = () => handlers['leave_custom_lobby'];
  
  Object.entries(handlers).forEach(([message, handler]) => {
    socket.on(message, handler);
  });
};