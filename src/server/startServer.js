import { Server } from 'http';
import { createApp } from './app';
import { initSocketServer } from './sockets';

const log = require('debug')('commander-periscope:server');

export function startServer(port, appOptions) {
  let io;
  const app = createApp(() => io, appOptions);
  const server = Server(app);
  io = initSocketServer(server);
  server._io = io;
  
  log(`creating server on port ${port}`);
  server.listen(port, () => {
    log(`commander-periscope server started on port ${server.address().port}`);
  });
  
  return server;
}