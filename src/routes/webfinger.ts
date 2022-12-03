import express from 'express';
import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../__generated__/sdk';

const router = express.Router();

router.get('/', async (req, res) => {
  const hostname = req.hostname;

  const resource = (req.query.resource ?? "") as string;

  if (!resource.startsWith('acct:') || !resource.endsWith(`@${hostname}`)) {
    return res.status(400)
              .send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
  }

  const uid = parseInt(resource.slice(5, -1-hostname.length));

  if (Number.isNaN(uid)) {
    return res.status(400)
              .send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
  }

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserWebFinger({ id: uid }).catch(err => {
    console.error(err);
    return { User: null };
  });

  if (data.User === null) {
    return res.status(400)
              .send('No User Found.');
  }

  const result = {
    "subject": `acct:${data.User.id}@${hostname}`,
    "aliases": [ data.User.siteUrl ].filter(e => e !== null),
    "links": [
      (data.User.siteUrl !== null) ? {
        "rel": "http://webfinger.net/rel/profile-page",
        "type": "text/html",
        "href": data.User.siteUrl
      } : null,
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": `https://${hostname}/user/${data.User.id}`
      }
    ].filter(e => e !== null)
  };

  return res.type('application/jrd+json').json(result);
});

export { router };
