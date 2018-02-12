import { registerErrorHandlers } from './errors';
import { startServer } from './startServer';

registerErrorHandlers();

const appOptions = {
  shouldLog: true,
  useDevServer: process.env.NODE_ENV !== 'production',
};
const port = parseInt(process.env.PORT) || 8080;
startServer(port, appOptions);
