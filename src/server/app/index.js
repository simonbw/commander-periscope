import CookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import * as Path from 'path';
import Favicon from 'serve-favicon';
import GuaranteeUserMiddleware from './GuaranteeUserMiddleware';
import renderIndexView from './renderIndexView';

// TODO: Maybe don't do this all at init time. Put it in methods so we can test it?

const app = express();

app.use(Favicon(Path.join(__dirname, '../../../favicon.ico')));
app.use(morgan('dev'));
app.use(CookieParser());
app.use(GuaranteeUserMiddleware);

const staticLocation = '/index.js';

// TODO: Probably a lot of stuff. I'm not exactly sure what.

app.get('/testing', (req, res) => {
  res.send({ success: true });
});

app.get(['/', '/:lobbyId'], (req, res) => {
  res.send(renderIndexView(staticLocation, req.params.lobbyId));
});

export default app;
