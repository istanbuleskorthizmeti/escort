import { NodeSSH } from 'node-ssh';

import dotenv from 'dotenv';
dotenv.config();

const ssh = new NodeSSH();

const config = {
  host: process.env.SSH_HOST || '31.97.79.34',
  username: process.env.SSH_USER || 'root',
  password: process.env.SSH_PASSWORD || '',
  readyTimeout: 20000
};

async function executeDeployment() {
  try {
    console.log(`🔐 [CONNECTING] Connecting to Server ${config.host}...`);
    await ssh.connect(config);
    console.log('✅ [CONNECTED] Access granted.');

    const pat = process.env.GITHUB_PAT || '';
    const commands = [
      'rm -rf /root/esc',
      `git clone https://${pat}@github.com/guondyshop-del/hydra-god-mode.git /root/esc`,
      'cd /root/esc && npm install',
      'cd /root/esc && npx prisma generate',
      'cd /root/esc && npx next build',
      'cd /root/esc && pm2 start ecosystem.config.js',
      'pm2 save',
      'systemctl restart nginx'
    ];

    for (const cmd of commands) {
      console.log(`📡 [EXEC] ${cmd}`);
      const res = await ssh.execCommand(cmd);
      if (res.stderr && !res.stderr.includes('Cloning into') && !res.stderr.includes('npm WARN') && !res.stderr.includes('deprecat')) {
          console.warn(`⚠️ [STDERR] ${res.stderr.substring(0, 200)}...`);
      }
      if (res.stdout) {
          console.log(`✅ [STDOUT] ${res.stdout.substring(0, 100)}...`);
      }
    }

    console.log('🏁 [GOD MODE DEPLOYMENT COMPLETE] Sites should be LIVE.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [DEPLOYMENT FAILED]', e);
    ssh.dispose();
  }
}

executeDeployment();
