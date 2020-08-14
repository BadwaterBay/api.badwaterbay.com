/**
 * Route /apps
 */

import express from 'express';
import { router as labelcopierRouter } from './labelcopier';

const router = express.Router({ mergeParams: true });

/* GET /apps */
router.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com/apps',
  });
});

router.use('/labelcopier', labelcopierRouter);

export default router;
