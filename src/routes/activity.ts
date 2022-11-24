import express from 'express';

const router = express.Router();

router.get('/:aid', async (req, res) => {
  const aid = req.params.aid;
  if (!aid) {
    return res.status(400).send('Bad request.');
  }

  // TODO
  return res.status(418).end();
});

export { router };
