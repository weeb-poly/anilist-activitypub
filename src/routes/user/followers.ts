import { Hono } from 'hono';

import { AniListClient } from '../../modules/anilist';

import { gql } from '../../__generated__/gql';

const router = new Hono();

const getUserFollowers = gql(/* GraphQL */ `
  query getUserFollowers($id: Int!, $page: Int) {
    Page(page: $page) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      followers(userId: $id) {
        id
      }
    }
  }
`);

router.get('/user/:uid/social/followers', async (c) => {
  // NOTE: param is not part of Fetch API
  const _uid = c.req.param('uid');

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#followers" doesn't do anything

    return c.redirect(
      `https://anilist.co/user/${_uid}/social#followers`
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

  // NOTE: query is not part of Fetch API
  const page = parseInt(c.req.query('page'));

  const data = await AniListClient.request(
    getUserFollowers,
    {
      id: uid,
      page: Number.isNaN(page) ? null : page
    }
  ).catch(err => {
    console.error(err);
    return { Page: null };
  });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;

  if (Number.isNaN(page)) {
    const res = c.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${uid}/social/followers`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${uid}/social/followers?page=1`
    });
    res.headers.set('Content-Type', 'application/activity+json');
    return res;
  }

  const followers = (data.Page?.followers ?? []).filter((e): e is Exclude<typeof e, null> => e !== null);

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${uid}/social/followers?page=${page}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "partOf": `https://${hostname}/user/${uid}/social/followers`,
    "orderedItems": followers.map(u => `https://${hostname}/user/${u.id}`)
  };

  if (data.Page?.pageInfo?.hasNextPage ?? false) {
    result["next"] = `https://${hostname}/user/${uid}/social/followers?page=${page+1}`;
  }

  // Note: There is no way to override the content-type of `c.json`
  const res = c.json(result)
  res.headers.set('Content-Type', 'application/activity+json');
  return res;
});

export default router;
