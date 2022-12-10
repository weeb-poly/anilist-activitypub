import express from 'express';
import { GraphQLClient } from 'graphql-request';

import { gql } from '../__generated__/gql';

const router = express.Router();

const getUserWebFinger = gql(/* GraphQL */ `
  query getUserWebFinger($id: Int!) {
    User (id: $id) {
      id
      siteUrl
    }
  }
`);

router.get('/', async (req, res) => {
  const hostname = req.hostname;

  const resource = (req.query.resource ?? "") as string;

  if (!resource.startsWith('acct:') || !resource.endsWith(`@${hostname}`)) {
    return res.status(400)
              .send('Invalid resource');
  }

  const uid = parseInt(resource.slice(5, -1-hostname.length));

  if (Number.isNaN(uid)) {
    return res.status(400)
              .send('Invalid User ID');
  }

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;

  const data = await AniListClient.request(getUserWebFinger, { id: uid }).catch(err => {
    console.error(err);
    return { User: null };
  });

  if (data.User === null) {
    return res.status(400)
              .send('No User Found');
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
