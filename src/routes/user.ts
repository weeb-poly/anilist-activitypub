import express from 'express';

import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../__generated__/sdk';


const router = express.Router();

router.get('/:name', async (req, res) => {
  const hostname = req.hostname;

  const name = parseInt(req.params.name);
  if (name === NaN) {
    return res.status(400).send('Bad request.');
  }

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserPerson({ id: name });

  // Handling stupid edge cases in the AniList GraphQL Schema
  if (data.User === null) {
    return res.status(400)
              .send('No User Found.');
  }

  const result: any = {
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

  return res.json(result);
});

router.get('/:name/social/following', async (req, res) => {
  const hostname = req.hostname;

  const name = parseInt(req.params.name);

  if (name === NaN) {
    return res.status(400).send('Bad request.');
  }

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserFollowing({ id: name, page: pageNum });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;

  if (pageNum === null) {
    return res.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${name}/social/following`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${name}/social/following?page=1`
    });
  }

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${name}/social/following?page=${pageNum}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "partOf": `https://${hostname}/user/${name}/social/following`,
    "orderedItems": (data.Page?.following ?? []).map(name => `https://${hostname}/user/${name}`)
  };

  if (data.Page?.pageInfo?.hasNextPage ?? false) {
    result["next"] = `https://${hostname}/user/${name}/social/following?page=${pageNum+1}`;
  }

  return res.json(result);

  // TODO
  // Should be easy, since we're just translating the AniList Pagination

  // return res.status(418).end();
});

router.get('/:name/social/followers', async (req, res) => {
  const hostname = req.hostname;

  const name = parseInt(req.params.name);

  if (name === NaN) {
    return res.status(400).send('Bad request.');
  }

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserFollowers({ id: name, page: pageNum });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;

  if (pageNum === null) {
    return res.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${name}/social/followers`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${name}/social/followers?page=1`
    });
  }

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${name}/social/followers?page=${pageNum}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "partOf": `https://${hostname}/user/${name}/social/followers`,
    "orderedItems": (data.Page?.followers ?? []).map(name => `https://${hostname}/user/${name}`)
  };

  if (data.Page?.pageInfo?.hasNextPage ?? false) {
    result["next"] = `https://${hostname}/user/${name}/social/followers?page=${pageNum+1}`;
  }

  return res.json(result);

  // TODO
  // Should be easy, since we're just translating the AniList Pagination

  // return res.status(418).end();
});



router.get('/:name/social/outbox', async (req, res) => {
  const hostname = req.hostname;

  const name = parseInt(req.params.name);

  if (name === NaN) {
    return res.status(400).send('Bad request.');
  }

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserOutbox({ id: name, page: pageNum });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;
  const lastPage = data.Page?.pageInfo?.lastPage ?? NaN;

  if (pageNum === null) {
    return res.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${name}/social/outbox`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${name}/social/outbox?page=1`,
      "last": `https://${hostname}/user/${name}/social/outbox?page=${lastPage}`
    });
  }

  // Note:
  // - Pagination isn't done by timestamp (extra processing)
  // - ActivityReply isn't part of ActivityUnion (can't be indexed this way)
  // - Actions (Block, Edit, Delete, Like, Dislike, etc) aren't part of ActivityUnion
  // - All AniList activities need to be translated to "Note"s for them to be viewable on Mastodon
  // These are limitations on the AniList API and there are no workaround for these as of now

  // TODO
  return res.status(418).end();

});

export { router };
