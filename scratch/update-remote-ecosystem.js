const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function updateEcosystem() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    const ecosystemContent = `
module.exports = {
  apps: [
    {
      name: "drkcnay-web-cluster",
      script: "npm",
      args: "run start",
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    },
    {
      name: "hydra-telegram-bot",
      script: "npx",
      args: "tsx scripts/master/telegram-master.ts",
      interpreter: "none",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "hydra-auto-index",
      script: "npx",
      args: "tsx scripts/master/indexing-sniper.ts",
      interpreter: "none",
      autorestart: false,
      cron_restart: "0 4 * * *",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "hydra-audit-watchdog",
      script: "npx",
      args: "tsx scripts/master/audit-engine.ts",
      interpreter: "none",
      autorestart: true
    }
  ]
}
`;

    await ssh.execCommand(`echo '${ecosystemContent.replace(/'/g, "'\\''")}' > ecosystem.config.js`, { cwd: '/root/esc' });
    console.log('Ecosystem updated.');

    await ssh.execCommand('pm2 delete all');
    const start = await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });
    console.log(start.stdout);

    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

updateEcosystem();
