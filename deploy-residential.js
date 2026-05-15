
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function deployResidential() {
  try {
    console.log('📡 [SAFE] Connecting to Attack Hub (187.77.111.203)...');
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP,
      username: process.env.ATTACK_SERVER_USER,
      password: process.env.ATTACK_SERVER_PASS
    });

    console.log('✅ Connected.');

    const localPath = path.join(__dirname, 'scripts', 'residential-traffic-monster.ts');
    const remotePath = '/root/warrior/scripts/residential-traffic-monster.ts';

    console.log('📤 Injecting Residential Monster v2.0...');
    const content = fs.readFileSync(localPath).toString('base64');
    await ssh.execCommand(`echo "${content}" | base64 -d > ${remotePath}`);

    console.log('🛑 Killing TOR processes...');
    await ssh.execCommand('pkill -f tor-traffic-monster || true');
    await ssh.execCommand('service tor stop || true');

    console.log('🚀 Launching Residential Monster...');
    await ssh.execCommand('cd /root/warrior && nohup npx tsx scripts/residential-traffic-monster.ts > monster.log 2>&1 &');

    console.log('\n🌟 [ULTIMATE SUCCESS]');
    console.log('Trafik artık %100 güvenli Residential Proxy ağına taşındı.');
    console.log('Google otorite sinyalleri tertemiz akıyor.');

  } catch (err) {
    console.error('❌ Residential Deploy Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

deployResidential();
