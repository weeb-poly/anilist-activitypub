import { Hono } from 'hono';

import { AniListClient } from '../../modules/anilist';

import { gql } from '../../__generated__/gql';

const router = new Hono();

const getUserPerson = gql(/* GraphQL */ `
  query getUserPerson($id: Int!) {
    User (id: $id) {
      id
      name
      avatar {
        large
      }
      bannerImage
    }
  }
`);

router.get('/user/:uid', async (c) => {
  // NOTE: param is not part of Fetch API
  const _uid = c.req.param('uid');

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#inbox" doesn't do anything

    return c.redirect(
      `https://anilist.co/user/${_uid}`
    );
  }

  const hostname = c.req.headers.get('Host') ?? "";

  const uid = parseInt(_uid);
  if (Number.isNaN(uid)) {
    return new Response(
      'Bad request',
      { status: 400 }
    );
  }

  const data = await AniListClient.request(getUserPerson, { id: uid }).catch(err => {
    console.error(err);
    return { User: null };
  });

  // Handling stupid edge cases in the AniList GraphQL Schema
  if (data.User === null) {
    return new Response(
      'No User Found',
      { status: 400 }
    );
  }

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${data.User.id}`,
    "type": "Person",
    "name": data.User.name,
    "following": `https://${hostname}/user/${data.User.id}/social/following`,
    "followers": `https://${hostname}/user/${data.User.id}/social/followers`,
    "inbox": `https://${hostname}/user/${data.User.id}/social/inbox`,
    "outbox": `https://${hostname}/user/${data.User.id}/social/outbox`,
    "icon": {
      "type": "Image",
      "mediaType": "image/png",
      "url": data.User.avatar?.large ?? null
    },
    "image": {
      "type": "Image",
      "mediaType": "image/jpeg",
      "url": data.User.bannerImage
    }
  };

  if (result.icon.url === null) {
    delete result["icon"];
  }

  // Note: There is no way to override the content-type of `c.json`
  const res = c.json(result);
  res.headers.set('Content-Type', 'application/activity+json');
  return res;
});

export default router;
