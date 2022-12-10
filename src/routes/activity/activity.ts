import { Hono } from 'hono';

import { AniListClient } from '../../modules/anilist';

import { gql } from '../../__generated__/gql';


const router = new Hono();

const getActivity = gql(/* GraphQL */ `
  query getActivity($id: Int!) {
    Activity(id: $id) {
      __typename
      ... on TextActivity {
        id
        siteUrl
      }
      ... on ListActivity {
        id
        siteUrl
      }
      ... on MessageActivity {
        id
        siteUrl
      }
    }
  }
`);

router.get('/activity/:aid', async (c) => {
  // NOTE: param is not part of Fetch API
  const aid = c.req.param('aid');

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)

    return c.redirect(
      `https://anilist.co/activity/${aid}`
    );
  }

  if (!aid) {
    return new Response(
      'Bad request',
      { status: 400 }
    );
  }

  // TODO
  return new Response(
    null, { status: 418 }
  );
});

export default router;
