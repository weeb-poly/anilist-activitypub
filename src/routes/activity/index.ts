import { Hono } from 'hono';

import activity from "./activity";
import reply from "./reply";

const router = new Hono();

// GET /activity/:aid
router.route('/', activity)

// GET /activity/:aid/:rid
router.route('/', reply)

export default router;
