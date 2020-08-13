/**
 * Route /labelcopier
 */

import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const router = express.Router();
const clientId = '561772fb708140a85b71';
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const randomStringAuth = uuidv4();

const redirectUriForAuth =
  process.env.NODE_ENV === 'production'
    ? 'https://api.badwaterbay.com/labelcopier/oauth-callback'
    : 'http://localhost:5036/labelcopier/oauth-callback';

const requestedScopes = 'repo';

const redirectUriWithToken =
  process.env.NODE_ENV === 'production'
    ? 'https://badwaterbay.com/labelcopier'
    : 'http://localhost:5000/labelcopier';

const urlForLoginGithub = () =>
  'https://github.com/login/oauth/authorize' +
  `?client_id=${clientId}` +
  `&scope=${requestedScopes}` +
  `&redirect_uri=${redirectUriForAuth}` +
  `&state=${randomStringAuth}`;

router.get('/oauth', (req, res, next) => {
  res.redirect(urlForLoginGithub());
});

const urlForExchangeForGithubAccessToken = () => {
  return 'https://github.com/login/oauth/access_token';
};

router.get('/oauth-callback', (req, res, next) => {
  // if (req.query.state !== randomStringAuth) {
  //   throw new Error(
  //     'Returned state does not match the state sent. The connection may be compromised. Aborting.'
  //   );
  // }

  const bodyForExchange = {
    client_id: clientId,
    client_secret: clientSecret,
    code: req.query.code,
    state: randomStringAuth,
  };

  const optsForExchange = { headers: { accept: 'application/json' } };

  axios
    .post(urlForExchangeForGithubAccessToken(), bodyForExchange, optsForExchange)
    .then((response) => response.data.access_token)
    .then((token) => {
      const authSuccess = token !== null;
      res.redirect(`${redirectUriWithToken}?auth-success=${authSuccess}&token=${token}`);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

export default router;
