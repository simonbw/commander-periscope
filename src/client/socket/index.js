import SocketIo from 'socket.io-client';
import { getActionHandlers } from './ActionSocketHandlers';
import { getConnectionHandlers } from './ConnectionSocketHandlers';
import { getLobbyHandlers } from './CustomLobbyHandlers';

const ioSocketLocation = window._ioSocketLocation || '';

export default (getState, dispatch) => {
  const socket = SocketIo(ioSocketLocation);
  
  const handlers = [].concat(
    getLobbyHandlers(getState, dispatch),
    getConnectionHandlers(dispatch),
    getActionHandlers(dispatch)
  );
  
  for (const [event, handler] of handlers) {
    socket.on(event, handler)
  }
  
  return socket;
}
