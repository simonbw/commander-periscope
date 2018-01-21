import SocketIo from 'socket.io-client';
import { ID, LOBBY } from '../../common/StateFields';
import { joinCustomLobby } from '../actions/CustomLobbyActions';
import { connected, disconnected } from '../actions/GeneralActions';
import { messageToAction } from '../actions/SocketActions';

const log = require('debug')('commander-periscope:server');

const ioSocketLocation = window.ioSocketLocation || '';

// TODO: Try to separate out custom-lobby-specific logic from general-messaging logic.
// This file is not the place for it to be

export default (getStore) => {
  const socket = SocketIo(ioSocketLocation);
  socket.on('action', (message) => {
    // TODO: more explicit conversions
    getStore().dispatch(messageToAction(message));
  });
  
  socket.on('connect', () => {
    log('socket.io connect');
    
    const store = getStore();
    store.dispatch(connected());
    
    // Try to reconnect to lobby
    const lobbyId = store.getState().getIn([LOBBY, ID]) || window.location.pathname.substring(1);
    if (lobbyId) {
      store.dispatch(joinCustomLobby(lobbyId));
    }
  });
  
  socket.on('disconnect', () => {
    log('socket.io disconnect');
    getStore().dispatch(disconnected());
  });
  
  return socket;
}