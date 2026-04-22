module.exports = {
  apps: [
    {
      name: 'email_assistant',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3008,
      },
    },
  ],
};
