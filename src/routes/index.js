/**
 * Route /
 */

import express from 'express';
import appsRouter from './apps';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com',
  });
});

router.use('/apps', appsRouter);

export default router;
