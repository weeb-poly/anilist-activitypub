import express from 'express';

import { GraphQLClient } from 'graphql-request';

const router = express.Router();

router.get('/:name', async (req, res) => {
  const hostname = req.hostname;

  const name = req.params.name;
  if (!name) {
    return res.status(400).send('Bad request.');
  }

  const GqlQuery = `
  query ($id: Int!) {
    User (id: $id) {
      id
      name
      avatar {
        large
      }
      bannerImage
    }
  }
  `;
  
  interface TData {
    User: {
      id: number;
      name: string;
      siteUrl: string;
      avatar: {
        large: string;
      };
      bannerImage: string;
    }
  }
  
  const anilist = req.app.get('anilist') as GraphQLClient;
  const data = await anilist.request<TData>(GqlQuery, { "id": name });

  return res.json({
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      { "anilist": `http://${hostname}/ns#` }
    ],
    "id": `https://${hostname}/user/${data.User.id}`,
    "type": "Person",
    "name": data.User.name,
    "following": `https://${hostname}/user/${data.User.id}/social/following`,
    "followers": `https://${hostname}/user/${data.User.id}/social/followers`,
    //"outbox": `https://${hostname}/user/${data.User.id}/social/outbox`,
    "icon": {
      "type": "Image",
      "mediaType": "image/png",
      "url": data.User.avatar.large
    },
    "image": {
      "type": "Image",
      "mediaType": "image/jpeg",
      "url": data.User.bannerImage
    }
  });
});

router.get('/:name/social/following', async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).send('Bad request.');
  }

  const GqlQuery = `
  query ($id: Int!, $page: Int) {
    Page(page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      following(userId: $id) {
        id
      }
    }
  }
  `;

  interface TData {
    Page: {
      pageInfo: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
        hasNextPage: boolean;
      }
      following: Array<{ id: number }>
    }
  }

  // TODO
  // Should be easy, since we're just translating the AniList Pagination

  return res.status(418).end();
});

router.get('/:name/social/followers', async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).send('Bad request.');
  }

  const GqlQuery = `
  query ($id: Int!, $page: Int) {
    Page(page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      followers(userId: $id) {
        id
      }
    }
  }
  `;

  interface TData {
    Page: {
      pageInfo: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
        hasNextPage: boolean;
      }
      followers: Array<{ id: number }>
    }
  }

  // TODO
  // Should be easy, since we're just translating the AniList Pagination
  return res.status(418).end();
});


router.get('/:name/social/outbox', async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).send('Bad request.');
  }

  const GqlQuery = `
  query ($id: Int!, $page: Int) {
    Page(page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      activities(userId: $id) {
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
  }  
  `;

  // Note: ActivityReplies can't be looked up by userId.
  // This is a limitation of the AniList API.
  // There's no workaround for this as of now.

  // TODO
  return res.status(418).end();
});

export { router };
