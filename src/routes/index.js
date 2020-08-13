/**
 * Route /
 */

import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com',
  });
});

export default router;
