module.exports = {
  apps: [
    {
      script: 'npm start',
    },
  ],

  deploy: {
    production: {
      key: 'my-key.pem',
      user: 'root',
      host: '159.65.148.255',
      ref: 'origin/main',
      repo: 'git@github.com:dimpal001/the_fs.git',
      path: '/home/root',
      'pre-deploy-local': '',
      'post-deploy':
        'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'ForwardedAgent=yes',
    },
  },
}
