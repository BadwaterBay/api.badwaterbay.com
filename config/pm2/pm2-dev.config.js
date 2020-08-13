const commonConfig = require('./pm2.config');

module.exports = {
  apps: [
    {
      ...commonConfig,
      env: {
        PORT: 5036,
        NODE_ENV: 'development',
      },
    },
  ],
};
