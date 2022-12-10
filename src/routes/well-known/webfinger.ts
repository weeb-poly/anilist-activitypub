import { Hono } from 'hono';

import { AniListClient } from '../../modules/anilist';

import { gql } from '../../__generated__/gql';

const router = new Hono();

const getUserWebFinger = gql(/* GraphQL */ `
  query getUserWebFinger($id: Int!) {
    User (id: $id) {
      id
      siteUrl
    }
  }
`);

router.get('/.well-known/webfinger', async (c) => {
  const hostname = c.req.headers.get('Host') ?? "";
  // NOTE: query is not part of Fetch API
  const resource = c.req.query('resource');

  if (!resource.startsWith('acct:') || !resource.endsWith(`@${hostname}`)) {
    return new Response(
      'Invalid resource',
      { status: 400 }
    );
  }

  const uid = parseInt(resource.slice(5, -1-hostname.length));

  if (Number.isNaN(uid)) {
    return new Response(
      'Invalid User ID',
      { status: 400 }
    );
  }

  const data = await AniListClient.request(getUserWebFinger, { id: uid }).catch(err => {
    console.error(err);
    return { User: null };
  });

  if (data.User === null) {
    return new Response(
      'No User Found',
      { status: 400 }
    );
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

  // Note: There is no way to override the content-type of `c.json`
  const res = c.json(result);
  res.headers.set('Content-Type', 'application/jrd+json');
  return res;
});

export default router;
