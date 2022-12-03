import express from 'express';

import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../__generated__/sdk';


const router = express.Router();

router.get('/:uid', async (req, res) => {
  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)

    return res.redirect(
      `https://anilist.co/user/${req.params.uid}`
    );
  }

  const hostname = req.hostname;

  const uid = parseInt(req.params.uid);
  if (Number.isNaN(uid)) {
    return res.status(400).send('Bad request.');
  }

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserPerson({ id: uid }).catch(err => {
    console.error(err);
    return { User: null };
  });

  // Handling stupid edge cases in the AniList GraphQL Schema
  if (data.User === null) {
    return res.status(400)
              .send('No User Found.');
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

  return res.type('application/activity+json').json(result);
});

router.get('/:uid/social/following', async (req, res) => {
  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)
    // "#following" doesn't do anything

    return res.redirect(
      `https://anilist.co/user/${req.params.uid}/social#following`
    );
  }

  const hostname = req.hostname;

  const uid = parseInt(req.params.uid);

  if (Number.isNaN(uid)) {
    return res.status(400).send('Bad request.');
  }

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserFollowing({ id: uid, page: pageNum }).catch(err => {
    console.error(err);
    return { Page: null };
  });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;

  if (pageNum === null) {
    return res.type('application/activity+json').json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${uid}/social/following`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${uid}/social/following?page=1`
    });
  }

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${uid}/social/following?page=${pageNum}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "partOf": `https://${hostname}/user/${uid}/social/following`,
    "orderedItems": (data.Page?.following ?? []).map(uid => `https://${hostname}/user/${uid}`)
  };

  if (data.Page?.pageInfo?.hasNextPage ?? false) {
    result["next"] = `https://${hostname}/user/${uid}/social/following?page=${pageNum+1}`;
  }

  return res.type('application/activity+json').json(result);
});

router.get('/:uid/social/followers', async (req, res) => {
  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)
    // "#followers" doesn't do anything

    return res.redirect(
      `https://anilist.co/user/${req.params.uid}/social#followers`
    );
  }

  const hostname = req.hostname;

  const uid = parseInt(req.params.uid);

  if (Number.isNaN(uid)) {
    return res.status(400).send('Bad request.');
  }

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserFollowers({ id: uid, page: pageNum }).catch(err => {
    console.error(err);
    return { Page: null };
  });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;

  if (pageNum === null) {
    return res.type('application/activity+json').json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${uid}/social/followers`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${uid}/social/followers?page=1`
    });
  }

  const result: any = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${uid}/social/followers?page=${pageNum}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "partOf": `https://${hostname}/user/${uid}/social/followers`,
    "orderedItems": (data.Page?.followers ?? []).map(uid => `https://${hostname}/user/${uid}`)
  };

  if (data.Page?.pageInfo?.hasNextPage ?? false) {
    result["next"] = `https://${hostname}/user/${uid}/social/followers?page=${pageNum+1}`;
  }

  return res.type('application/activity+json').json(result);
});


router.post('/:uid/social/inbox', async (req, res) => {
  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#inbox" doesn't do anything

    return res.redirect(
      `https://anilist.co/user/${req.params.uid}/social#inbox`
    );
  }

  // There's no way for us handle Inbox messages at this time
  return res.status(405).send('Inbox is Unsupported.');
});


router.get('/:uid/social/outbox', async (req, res) => {
  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#outbox" doesn't do anything

    return res.redirect(
      `https://anilist.co/user/${req.params.uid}/social#outbox`
    );
  }

  const hostname = req.hostname;

  const uid = parseInt(req.params.uid);

  if (Number.isNaN(uid)) {
    return res.status(400).send('Bad request.');
  }

  // Since this isn't ready yet, we're returning dummy data so we can test everything else
  return res.type('application/activity+json').json({
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${hostname}/user/${uid}/social/outbox`,
    "type": "OrderedCollection",
    "totalItems": 0,
    "first": `https://${hostname}/user/${uid}/social/outbox?page=1`,
    "last": `https://${hostname}/user/${uid}/social/outbox?page=1`
  });

  const pageNum = (req.query.page !== undefined) ? parseInt(req.query.page as string) : null;

  const AniListClient = req.app.get('AniListClient') as GraphQLClient;
  const AniListSdk = getSdk(AniListClient);

  const data = await AniListSdk.getUserOutbox({ id: uid, page: pageNum });

  const totalItems = data.Page?.pageInfo?.total ?? NaN;
  const lastPage = data.Page?.pageInfo?.lastPage ?? NaN;

  if (pageNum === null) {
    return res.type('application/activity+json').json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `https://${hostname}/user/${uid}/social/outbox`,
      "type": "OrderedCollection",
      "totalItems": totalItems,
      "first": `https://${hostname}/user/${uid}/social/outbox?page=1`,
      "last": `https://${hostname}/user/${uid}/social/outbox?page=${lastPage}`
    });
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
  return res.status(418).end();
});

export { router };
