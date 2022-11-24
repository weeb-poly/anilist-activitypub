import express from 'express';
import { GraphQLClient } from 'graphql-request';

const router = express.Router();

router.get('/', async (req, res) => {
  const hostname = req.hostname;

  const resource = (req.query.resource ?? "") as string;

  if (!resource.startsWith('acct:') || !resource.endsWith(`@${hostname}`)) {
    return res.status(400)
              .send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
  }

  const name = resource.slice(5, -1-hostname.length);

  const GqlQuery = `
  query ($id: Int!) {
    User (id: $id) {
      id
      siteUrl
    }
  }
  `;

  interface TData {
    User: { id: number; siteUrl: string }
  }

  const anilist = req.app.get('anilist') as GraphQLClient;
  const data = await anilist.request<TData>(GqlQuery, { "id": name });

  return res.type('application/jrd+json').json({
    "subject": `acct:${data.User.id}@${hostname}`,
    "aliases": [ data.User.siteUrl ],
    "links": [
      {
        "rel": "http://webfinger.net/rel/profile-page",
        "type": "text/html",
        "href": data.User.siteUrl
      },
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": `https://${hostname}/user/${data.User.id}`
      }
    ]
  });
});

export { router };
