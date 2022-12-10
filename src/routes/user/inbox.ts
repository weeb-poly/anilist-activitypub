import { Hono } from 'hono';

const router = new Hono();

router.post('/user/:uid/social/inbox', async (c) => {
  // NOTE: param is not part of Fetch API
  const uid = c.req.param('uid');

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)
    // There's no good equivalent for outbox
    // "#inbox" doesn't do anything

    return c.redirect(
      `https://anilist.co/user/${uid}/social#inbox`
    );
  }

  // There's no way for us handle Inbox messages at this time
  return new Response(
    'Inbox is Unsupported',
    { status: 405 }
  );
});

export default router;
