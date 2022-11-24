import express from 'express';
import http from 'http';

import { client as anilist } from './modules/anilist';
import * as routes from './routes';

const app = express();

app.set('anilist', anilist);

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use('/.well-known/webfinger', routes.webfinger);
app.use('/user', routes.user);
app.use('/activity', routes.activity);

const PORT = app.get('port');

http.createServer(app).listen(PORT, () => {
  console.log('Express server listening on port', PORT);
});
