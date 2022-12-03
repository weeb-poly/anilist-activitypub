import express from 'express';
import http from 'http';

import { AniListClient } from './modules/anilist';
import * as routes from './routes';

// THIS FILE IS THE GENERATED FILE
import { getSdk } from './__generated__/sdk';

const app = express();

app.set('AniListClient', AniListClient);

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use('/.well-known/webfinger', routes.webfinger);
app.use('/user', routes.user);
app.use('/activity', routes.activity);

const PORT = app.get('port');

http.createServer(app).listen(PORT, () => {
  console.log('Express server listening on port', PORT);
});
