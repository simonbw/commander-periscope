import CookieParser from 'cookie-parser';
import express from 'express';
import * as path from 'path';
import Favicon from 'serve-favicon';
import GuaranteeUserMiddleware from './GuaranteeUserMiddleware';
import Healthcheck from './Healthcheck';
import renderIndexView from './renderIndexView';

const log = require('debug')('commander-periscope:server');

export const createApp = (getIo, { shouldLog = true, useDevServer = false }) => {
  const app = express();
  
  if (useDevServer) {
    log('using webpack-dev-middleware');
    const Webpack = require('webpack');
    const WebpackDevMiddleware = require('webpack-dev-middleware');
    const webpackOptions = require('../../../webpack.config');
    const compiler = Webpack(webpackOptions);
    app.use(WebpackDevMiddleware(compiler, {
      progress: false,
      stats: false,
      logLevel: 'error'
    }));
  } else { // prod
    const staticPath = path.join(__dirname, '../../client');
    app.use(express.static(staticPath));
  }
  
  if (shouldLog) {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }
  
  app.use(Favicon(path.join(__dirname, '../../../favicon.ico')));
  app.use(CookieParser());
  app.use(GuaranteeUserMiddleware);
  
  app.use('/healthcheck', Healthcheck(getIo));
  
  const indexJsUrl = '/index.js';
  app.get(['/', '/:lobbyId'], (req, res) => {
    res.send(renderIndexView(indexJsUrl, req.params.lobbyId));
  });
  
  return app;
};
