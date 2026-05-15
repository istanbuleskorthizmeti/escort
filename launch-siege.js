
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function launch() {
  try {
    console.log('📡 [GOD MODE] Connecting to Production Server...');
    await ssh.connect({
      host: process.env.SSH_HOST || '213.232.235.181',
      username: process.env.SSH_USER || 'root',
      password: process.env.SSH_PASSWORD
    });

    console.log('✅ Connected.');

    // 1. Kill previous siege process
    console.log('🧹 Cleaning up old siege processes...');
    await ssh.execCommand('pkill -f hydra-deepseek-siege || true');

    const localPath = path.join(__dirname, 'scripts', 'hydra-deepseek-siege.ts');
    const remotePath = '/root/esc/scripts/hydra-deepseek-siege.ts';

    console.log('📤 Injecting Hydra Siege Engine v1.1 (Telegram Enabled)...');
    const content = fs.readFileSync(localPath);
    const base64 = content.toString('base64');
    
    // Create dir
    await ssh.execCommand('mkdir -p /root/esc/scripts');
    
    // Write via base64 to avoid SFTP/Escaping issues
    await ssh.execCommand(`echo "${base64}" | base64 -d > ${remotePath}`);
    
    console.log('🚀 Activating DeepSeek Content Siege...');
    // Start in background with nohup to persist after logout
    await ssh.execCommand(`cd /root/esc && nohup npx tsx scripts/hydra-deepseek-siege.ts > siege.log 2>&1 &`);

    console.log('\n🌟 [MISSION SUCCESS]');
    console.log('Taarruz sunucu tarafında (Alexhost) otonom olarak başladı.');
    console.log('İlerlemeyi izlemek için: ssh root@213.232.235.181 "tail -f /root/esc/siege.log"');

  } catch (err) {
    console.error('❌ Launch Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

launch();
