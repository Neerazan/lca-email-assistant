module.exports = {
  apps: [
    {
      name: 'lca-email-assistant',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/lca-email-assistant',
      
      // Server configuration
      port: 3001,
      env: {
        NODE_ENV: 'production'
      },
      
      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Logging
      error_file: '/var/log/pm2/lca-assistant-error.log',
      out_file: '/var/log/pm2/lca-assistant-out.log',
      log_file: '/var/log/pm2/lca-assistant-combined.log',
      time: true,
      
      // Graceful shutdown
      listen_timeout: 10000,
      kill_timeout: 5000,
      
      // Instance configuration
      instances: 1,
      exec_mode: 'fork',
    }
  ]
};
