module.exports = {
  apps: [
    {
      name: 'store_ddfb',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/html/store_ddfb',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
}
