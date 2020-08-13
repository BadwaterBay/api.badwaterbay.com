const commonConfig = require('./pm2.config');

module.exports = {
  apps: [
    {
      ...commonConfig,
      instances: 2,
      exec_mode: 'cluster',
      env: {
        PORT: 5036,
        NODE_ENV: 'production',
      },
    },
  ],
};
