import SocketIo from 'socket.io';
import CustomLobbySocketController from './CustomLobbySocketController';
import GameSocketController from './GameSocketController';
import SocketCookieParser from './SocketCookieParser';
import SocketUserAttacher from './SocketUserAttacher';

export function initSocketServer(server) {
  const io = SocketIo(server);
  io.use(SocketCookieParser());
  io.use(SocketUserAttacher());
  io.use(CustomLobbySocketController());
  io.use(GameSocketController());
  return io;
}
