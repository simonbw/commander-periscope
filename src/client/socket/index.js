import SocketIo from 'socket.io-client';
import { joinCustomLobby } from '../actions/CustomLobbyActions';
import { connected, disconnected } from '../actions/GeneralActions';
import { messageToAction } from '../actions/SocketActions';

const ioSocketLocation = window.ioSocketLocation || 'localhost:8080';

// TODO: Try to separate layers of logic for general messages from custom lobby specific stuff.

export default (getStore) => {
  const socket = SocketIo(ioSocketLocation);
  socket.on('action', (action) => {
    getStore().dispatch(messageToAction(action));
  });
  
  socket.on('connect', () => {
    console.log('socket.io connect');
    
    const store = getStore();
    store.dispatch(connected());
    
    // Try to reconnect to lobby
    const lobbyId = store.getState().getIn(['lobby', 'id']) || window.location.pathname.substring(1);
    if (lobbyId) {
      store.dispatch(joinCustomLobby(lobbyId));
    }
  });
  
  socket.on('disconnect', () => {
    console.log('socket.io connect');
    getStore().dispatch(disconnected());
  });
  
  return socket;
}