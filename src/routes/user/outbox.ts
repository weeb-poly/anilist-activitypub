import { Hono } from 'hono';

import { AniListClient } from '../../modules/anilist';

import { gql } from '../../__generated__/gql';

const router = new Hono();

const getUserOutbox = gql(/* GraphQL */ `
  query getUserOutbox($id: Int!, $page: Int) {
    Page(page: $page) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      activities(
        userId: $id,
        sort: ID_DESC
      ) {
        __typename
        ... on TextActivity {
          id
          siteUrl
          createdAt
        }
        ... on ListActivity {
          id
          siteUrl
          createdAt
        }
        ... on MessageActivity {
          id
          siteUrl
          createdAt
        }
      }
    }
  }
`);

router.post('/', async (c) => {
  // NOTE: param is not part of Fetch API
  const _uid = c.req.param('uid');

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#outbox" doesn't do anything

    return c.redirect(
      `https://anilist.co/user/${_uid}/social#outbox`
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

  // Since this isn't ready yet, we're returning dummy data so we can test everything else
  // Note: There is no way to override the content-type of `c.json`
  const res = c.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${uid}/social/outbox`,
    "type": "OrderedCollection",
    "totalItems": 0,
    "first": `https://${hostname}/user/${uid}/social/outbox?page=1`,
    "last": `https://${hostname}/user/${uid}/social/outbox?page=1`
  });
  res.headers.set('Content-Type', 'application/activity+json');
  return res;

  const page = parseInt(c.req.query('page'));

  const data = await AniListClient.request(
    getUserOutbox,
    {
      id: uid,
      page: Number.isNaN(page) ? null : page
    }
  ).catch(err => {
    console.error(err);
    return { Page: null };
  });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;
  const lastPage = data.Page?.pageInfo?.lastPage ?? NaN;

  if (Number.isNaN(page)) {
    const res = c.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${uid}/social/outbox`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${uid}/social/outbox?page=1`,
      "last": `https://${hostname}/user/${uid}/social/outbox?page=${lastPage}`
    });
    res.headers.set('Content-Type', 'application/activity+json');
    return res;
  }

  // Note:
  // - Pagination can't be done by Activity ID (not ideal)
  // - ActivityReply isn't part of ActivityUnion (replies aren't part of outbox)
  // - Actions (Block, Edit, Delete, Like, Dislike, etc) aren't stored this way
  // - All AniList activities need to be translated to "Note" types for them to be viewable on Mastodon
  // These are limitations on the AniList API and there are no workaround for these as of now

  // TODO:
  // - Convert TextActivity to Create + Note
  // - Convert MessageActivity to Create + Note
  // - Convert ListActivity to Create + Note (temp)
  // - Create Custom Schemas for ListActivity (future)
  return new Response(
    null, { status: 418 }
  );
});

export default router;
