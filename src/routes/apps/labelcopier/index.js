/**
 * Route /labelcopier
 */

import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const router = express.Router();
const installRouter = express.Router({ mergeParams: true });
const oAuthRouter = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com/apps/labelcopier',
  });
});

router.use('/oauth', oAuthRouter);
router.use('/install', installRouter);

/**
 * installRouter
 */

installRouter.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com/apps/labelcopier/install',
  });
});

const uriInstallNew = 'https://github.com/apps/labelcopier/installations/new';

installRouter.get('/new', (req, res, next) => {
  res.redirect(uriInstallNew);
});

/**
 * oAuthRouter
 */

oAuthRouter.get('/', (req, res, next) => {
  res.json({
    status: 200,
    ok: true,
    data: 'You are at api.badwaterbay.com/apps/labelcopier/oauth',
  });
});

// GitHub App credentials
const githubClient = {
  id: process.env.GITHUB_APP_CLIENT_ID,
  secret: process.env.GITHUB_APP_CLIENT_SECRET,
};

const oAuthState = uuidv4();

const uriAuthCallback =
  process.env.NODE_ENV === 'production'
    ? 'https://api.badwaterbay.com/apps/labelcopier/oauth/oauth-callback'
    : 'http://localhost:5036/apps/labelcopier/oauth/oauth-callback';

const uriGithubAuth = () =>
  'https://github.com/login/oauth/authorize' +
  `?client_id=${githubClient.id}` +
  `&redirect_uri=${uriAuthCallback}` +
  `&state=${oAuthState}`;

oAuthRouter.get('/authorize', (req, res, next) => {
  res.redirect(uriGithubAuth());
});

const uriGithubAccessToken = 'https://github.com/login/oauth/access_token';

const uriRediectWithToken =
  process.env.NODE_ENV === 'production'
    ? 'https://badwaterbay.com/labelcopier'
    : 'http://localhost:5000/labelcopier';

oAuthRouter.get('/oauth-callback', (req, res, next) => {
  console.log('/oauth-callback triggered');
  console.log(`code is ${req.query.code}`);
  // if (req.query.state !== oAuthState) {
  //   throw new Error(
  //     'Returned state does not match the state sent. The connection may be compromised. Aborting.'
  //   );
  // }

  const bodyForExchange = {
    client_id: githubClient.id,
    client_secret: githubClient.secret,
    code: req.query.code,
    state: oAuthState,
  };

  const optsForExchange = { headers: { accept: 'application/json' } };

  axios
    .post(uriGithubAccessToken, bodyForExchange, optsForExchange)
    .then((response) => response.data.access_token)
    .then((token) => {
      res.redirect(`${uriRediectWithToken}?token=${token}`);
    })
    .catch(() => {
      res.redirect(`${uriRediectWithToken}?token=null`);
    });
});

export { router, oAuthRouter };
