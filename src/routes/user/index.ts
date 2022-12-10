import { Hono } from 'hono';

import user from "./user";
import following from "./following";
import followers from "./followers";
import outbox from "./outbox";
import inbox from "./inbox";


const router = new Hono();

// GET /user/:uid
router.route('/', user);

// GET /user/:uid/social/following
router.route('/', following);

// GET /user/:uid/social/followers
router.route('/', followers);

// GET /user/:uid/social/outbox
router.route('/', outbox);

// POST /user/:uid/social/inbox
router.route('/', inbox);

export default router;
