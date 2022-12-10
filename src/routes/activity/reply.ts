import { Hono } from 'hono';

const router = new Hono();

router.get('/activity/:aid/:rid', async (c) => {
  // NOTE: param is not part of Fetch API
  const aid = c.req.param("aid");

  const rid = c.req.param("rid");

  if (!(c.req.headers.get('Accept') ?? "").includes('application/activity+json')) {
    // Redirect to AniList (no validation on our side)

    return c.redirect(
      `https://anilist.co/activity/${aid}#${rid}`
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
  )
});

export default router;
