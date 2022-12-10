import { Hono } from 'hono';

import webfinger from "./webfinger";

const router = new Hono();

// GET /.well-known/webfinger
router.route('/', webfinger);

export default router;
