module.exports = {
  apps: [
    {
      name: 'email_assistant',
      script: 'node',
      args: 'server.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3008,
      },
    },
  ],
};
