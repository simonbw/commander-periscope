import { Server } from 'http';
import createApp from './app';
import { registerErrorHandlers } from './errors';
import { initSocketServer } from './sockets'

const log = require('debug')('commander-periscope:server');

registerErrorHandlers();

// TODO: Production mode
const devMode = process.env.NODE_ENV !== 'prod';
const server = Server(createApp({ devServer: devMode }));
initSocketServer(server);

const port = parseInt(process.env.PORT) || 8080;

server.listen(port, () => {
  log(`commander-periscope server started on port ${port}`);
});

// GENERAL TODO: Enforce some stricter style standards. Be consistent with the type of function declaration we're using.