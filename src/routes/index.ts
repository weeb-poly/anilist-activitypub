import { Hono } from 'hono';

import wellKnown from "./well-known";
import user from "./user";
import activity from "./activity";

const router = new Hono();

router.route('/', wellKnown);

router.route('/', user);

router.route('/', activity);

export default router;
