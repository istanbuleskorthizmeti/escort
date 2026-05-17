const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function deployAndRun() {
  const targetHost = '187.77.111.203';
  const targetPass = 'Z4-nN8JfiUIh5,;g';

  try {
    await ssh.connect({
      host: targetHost,
      username: 'root',
      password: targetPass
    });

    console.log('🚀 [DEPLOY] Connected to Attack Server...');

    // 1. Sync critical files
    const filesToSync = [
      { local: 'scripts/hydra-all-out-war.ts', remote: '/root/esc/scripts/hydra-all-out-war.ts' },
      { local: 'config/authority-hubs.ts', remote: '/root/esc/config/authority-hubs.ts' },
      { local: 'config/blogger-ids.ts', remote: '/root/esc/config/blogger-ids.ts' },
      { local: 'lib/seo/neighborhood-map.ts', remote: '/root/esc/lib/seo/neighborhood-map.ts' }
    ];

    for (const f of filesToSync) {
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
      console.log(`   ✅ Synced: ${f.local}`);
    }

    // 2. Fix Remote .env (Point to Escort DB)
    const remoteEnvUpdate = `sed -i 's/localhost:5432/213.232.235.181:5432/g' /root/esc/.env`;
    await ssh.execCommand(remoteEnvUpdate);
    console.log(`   ✅ Remote .env patched to Escort DB`);

    // 3. Start the Automatic War in background using PM2
    console.log(`🔥 [WAR] Starting Total War on Attack Server...`);
    const runCmd = 'cd /root/esc && export LLM_MODEL="deepseek-reasoner" && pm2 stop hydra-war || true && pm2 start "npx tsx scripts/hydra-all-out-war.ts" --name hydra-war --no-autorestart';
    const result = await ssh.execCommand(runCmd);
    
    console.log('--- REMOTE OUTPUT ---');
    console.log(result.stdout || result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('❌ Deployment Failed:', err.message);
    ssh.dispose();
  }
}

deployAndRun();
