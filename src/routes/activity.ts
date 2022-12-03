import express from 'express';

const router = express.Router();

router.get('/:aid', async (req, res) => {
  const aid = req.params.aid;

  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)

    return res.redirect(
      `https://anilist.co/activity/${aid}`
    );
  }

  if (!aid) {
    return res.status(400).send('Bad request.');
  }

  // TODO
  return res.status(418).end();
});

router.get('/:aid/:rid', async (req, res) => {
  const aid = req.params.aid;
  const rid = req.params.rid;

  if (req.accepts('text/html')) {
    // Redirect to AniList (no validation on our side)
    // There's no way to directly link to ActivityReplies as of now.

    return res.redirect(
      `https://anilist.co/activity/${aid}#${rid}`
    );
  }

  if (!aid) {
    return res.status(400).send('Bad request.');
  }

  // TODO
  return res.status(418).end();
});

export { router };
