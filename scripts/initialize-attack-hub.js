
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function initAttackHub() {
  try {
    console.log('📡 [GOD MODE] Connecting to ATTACK HUB (187.77.111.203)...');
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP,
      username: process.env.ATTACK_SERVER_USER,
      password: process.env.ATTACK_SERVER_PASS
    });

    console.log('✅ Connected to Attack Server.');

    console.log('⚙️ Preparing Environment...');
    // Node.js ve gerekli araçların kontrolü/kurulumu
    await ssh.execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -');
    await ssh.execCommand('apt-get install -y nodejs git build-essential');
    
    await ssh.execCommand('mkdir -p /root/hydra-attack/scripts');
    await ssh.execCommand('mkdir -p /root/hydra-attack/payloads');

    console.log('📤 Injecting Attack Scripts...');
    // Parasite Hub scriptini bu sunucuya da basıyoruz
    const parasiteScript = fs.readFileSync(path.join(__dirname, 'scripts', 'hydra-parasite-hub.ts')).toString('base64');
    await ssh.execCommand(`echo "${parasiteScript}" | base64 -d > /root/hydra-attack/scripts/hydra-parasite-hub.ts`);

    console.log('\n🌟 [ATTACK HUB READY]');
    console.log('Saldırı sunucusu operasyonel hale getirildi.');
    console.log('Artık tüm agresif SEO görevlerini bu sunucu üzerinden yürütebiliriz.');

  } catch (err) {
    console.error('❌ Hub Initialization Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

initAttackHub();
