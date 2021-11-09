module.exports = {
  apps : [{
    name: 'app',
    script: './bin/www',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch:[
      "node_modules",
      "logs"
    ],
    max_memory_restart: '1G',
    "error_file": "./logs/app-err.log",
    "out_file": "./logs/app-out.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss",
    env:{
      NODE_ENV: 'development'
    },
    env_production:{
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '172.16.133.129',
      ref  : 'origin/main',
      repo : 'git@github.com:Nononoelle/coursera-test.git',
      path : '/usr/local/myProject',
      ssh_options: "StrictHostKeyChecking=no",
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      "env":{
        "NODE_ENV": "production"
      }
    }
  }
};
