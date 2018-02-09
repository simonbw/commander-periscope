import { Server } from 'http';
import createApp from './app';
import { registerErrorHandlers } from './errors';
import { initSocketServer } from './sockets'

const log = require('debug')('commander-periscope:server');

registerErrorHandlers();

const devMode = process.env.NODE_ENV !== 'production';
const server = Server(createApp({ useDevServer: devMode }));
initSocketServer(server);

const port = parseInt(process.env.PORT) || 8080;

server.listen(port, () => {
  log(`commander-periscope server started on port ${port}`);
});
