
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function deployToAttackHub() {
  try {
    console.log('📡 [SHADOW] Connecting to Attack Hub (187.77.111.203)...');
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP,
      username: process.env.ATTACK_SERVER_USER,
      password: process.env.ATTACK_SERVER_PASS
    });

    console.log('✅ Connected.');

    const localPath = path.join(__dirname, 'scripts', 'shadow-warrior.ts');
    const remotePath = '/root/warrior/scripts/shadow-warrior.ts';

    console.log('📤 Injecting Shadow Warrior v2.0...');
    const content = fs.readFileSync(localPath).toString('base64');
    
    await ssh.execCommand('mkdir -p /root/warrior/scripts');
    await ssh.execCommand(`echo "${content}" | base64 -d > ${remotePath}`);

    console.log('🚀 Activating Shadow Hunter...');
    // Kill old warriors and start the new one
    await ssh.execCommand('pkill -f ctr-warrior || true');
    await ssh.execCommand('cd /root/warrior && nohup npx tsx scripts/shadow-warrior.ts > warrior.log 2>&1 &');

    console.log('\n🌟 [ULTIMATE SUCCESS]');
    console.log('Shadow Warrior (CTR Engine) sunucuda ava çıktı.');
    console.log('Logları izlemek için: ssh root@187.77.111.203 "tail -f /root/warrior/warrior.log"');

  } catch (err) {
    console.error('❌ Shadow Deploy Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

deployToAttackHub();
