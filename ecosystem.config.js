require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "drkcnay-web-cluster",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/root/esc",
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=1024",
      exp_backoff_restart_delay: 1000,
      max_restarts: 10,
      min_uptime: "20s",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    },
    {
      name: "hydra-telegram-bot",
      script: "node",
      args: "-r dotenv/config dist_scripts/scripts/master/telegram-master.js",
      cwd: "/root/esc",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "hydra-auto-index",
      script: "node",
      args: "-r dotenv/config dist_scripts/scripts/master/indexing-sniper.js",
      cwd: "/root/esc",
      autorestart: false,
      cron_restart: "0 4 * * *", // 🕒 RUN EVERY DAY AT 4 AM
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "hydra-audit-watchdog",
      script: "node",
      args: "-r dotenv/config dist_scripts/scripts/master/audit-engine.js",
      cwd: "/root/esc",
      autorestart: true
    },
    {
      name: "hydra-fleet-gsc-automation",
      script: "npx",
      args: "tsx scripts/fleet-gsc-automation.ts",
      cwd: "/root/esc",
      autorestart: false,
      cron_restart: "0 5 * * *", // 🕒 RUN EVERY DAY AT 5 AM
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "hydra-gsc-enterprise",
      script: "npx",
      args: "tsx scripts/google-enterprise-integration.ts",
      cwd: "/root/esc",
      autorestart: false,
      cron_restart: "0 6 * * *", // 🕒 RUN EVERY DAY AT 6 AM
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
