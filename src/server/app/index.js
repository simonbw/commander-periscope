import CookieParser from 'cookie-parser';
import express from 'express';
import * as path from 'path';
import Favicon from 'serve-favicon';
import GuaranteeUserMiddleware from './GuaranteeUserMiddleware';
import renderIndexView from './renderIndexView';

const log = require('debug')('commander-periscope:server');

export default ({ shouldLog = true, devServer = false }) => {
  const app = express();
  
  if (devServer) {
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
  
  app.get('/healthcheck', (req, res) => {
    // TODO: real healthcheck. There are no dependencies, so I don't know what a real healthcheck would be.
    res.send({ status: 'OK' });
  });
  
  const indexJsUrl = '/index.js';
  app.get(['/', '/:lobbyId'], (req, res) => {
    res.send(renderIndexView(indexJsUrl, req.params.lobbyId));
  });
  
  return app;
}
