
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function launch() {
  try {
    console.log('📡 [GOD MODE] Connecting to Production Server...');
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP || process.env.SSH_HOST || '31.97.79.34',
      username: process.env.ATTACK_SERVER_USER || process.env.SSH_USER || 'root',
      password: process.env.ATTACK_SERVER_PASS || process.env.SSH_PASSWORD || 'Oym@icdLt?vY8YQy'
    });

    console.log('✅ Connected.');

    // 1. Kill previous siege process
    console.log('🧹 Cleaning up old siege processes...');
    await ssh.execCommand('pkill -f hydra-deepseek-siege || true');

    // Create dirs
    await ssh.execCommand('mkdir -p /root/esc/scripts /root/esc/lib /root/esc/config');

    // Upload config/domains.ts
    console.log('📤 Syncing config/domains.ts...');
    const configPath = path.join(__dirname, 'config', 'domains.ts');
    const remoteConfigPath = '/root/esc/config/domains.ts';
    const configContent = fs.readFileSync(configPath);
    const configBase64 = configContent.toString('base64');
    await ssh.execCommand(`echo "${configBase64}" | base64 -d > ${remoteConfigPath}`);

    // Upload lib/ai-provider.ts
    console.log('📤 Syncing lib/ai-provider.ts...');
    const libPath = path.join(__dirname, 'lib', 'ai-provider.ts');
    const remoteLibPath = '/root/esc/lib/ai-provider.ts';
    const libContent = fs.readFileSync(libPath);
    const libBase64 = libContent.toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > ${remoteLibPath}`);

    const localPath = path.join(__dirname, 'scripts', 'hydra-deepseek-siege.ts');
    const remotePath = '/root/esc/scripts/hydra-deepseek-siege.ts';

    console.log('📤 Injecting Hydra Siege Engine v1.1 (Telegram Enabled)...');
    const content = fs.readFileSync(localPath);
    const base64 = content.toString('base64');
    
    // Write via base64 to avoid SFTP/Escaping issues
    await ssh.execCommand(`echo "${base64}" | base64 -d > ${remotePath}`);
    
    console.log('🚀 Activating DeepSeek Content Siege...');
    // Start in background with nohup to persist after logout
    await ssh.execCommand(`cd /root/esc && nohup npx tsx scripts/hydra-deepseek-siege.ts > siege.log 2>&1 &`);

    console.log('\n🌟 [MISSION SUCCESS]');
    console.log('Taarruz sunucu tarafında (Alexhost) otonom olarak başladı.');
    console.log('İlerlemeyi izlemek için: ssh root@31.97.79.34 "tail -f /root/esc/siege.log"');

  } catch (err) {
    console.error('❌ Launch Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

launch();
