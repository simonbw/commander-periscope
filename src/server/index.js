import { Server } from 'http';
import app from './app';
import { registerErrorHandlers } from './errors';
import { initSocketServer } from './sockets'

if (process.env.NODE_DEBUG_OPTION) {
  console.log(`NODE_DEBUG_OPTION: ${process.env.NODE_DEBUG_OPTION}`);
}

registerErrorHandlers();

const server = Server(app);
initSocketServer(server);

const port = parseInt(process.env.PORT) || 8080;

server.listen(port, () => {
  console.log(`captain-sonar-server started on port ${port}`);
});

