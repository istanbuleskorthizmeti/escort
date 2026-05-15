const { NodeSSH } = require('node-ssh');

async function fixServer(host, password, name) {
  const ssh = new NodeSSH();
  try {
    console.log(`🚀 [FIX] Connecting to ${name} (${host})...`);
    await ssh.connect({
      host: host,
      username: 'root',
      password: password,
      readyTimeout: 60000
    });
    
    console.log(`✅ [${name}] Connected.`);

    // 1. Force kill all related processes
    console.log(`💀 [${name}] Killing node/pm2...`);
    await ssh.execCommand('pm2 kill');
    await ssh.execCommand('pkill -9 node');
    await ssh.execCommand('pkill -9 npm');

    // 2. Clear stale cache/build
    console.log(`🧹 [${name}] Cleaning .next...`);
    await ssh.execCommand('rm -rf /root/esc/.next');

    // 3. Restart Postgres just in case
    console.log(`🗄️ [${name}] Restarting Postgres...`);
    await ssh.execCommand('systemctl restart postgresql');

    // 4. Force build (if possible) or just start
    console.log(`🚀 [${name}] Starting app...`);
    // We try to start it. If it fails, we'll know from logs.
    await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });

    // 5. Restart Nginx
    console.log(`🌐 [${name}] Restarting Nginx...`);
    await ssh.execCommand('systemctl restart nginx');

    console.log(`✅ [${name}] Fix applied.`);
  } catch(e) {
    console.error(`❌ [${name}] Failed:`, e.message);
  } finally {
    ssh.dispose();
  }
}

async function run() {
  const password = '4TVuj7qiHMfh7CxH6K!';
  
  // Fix Alexhost Main
  await fixServer('213.232.235.181', password, 'ALEXHOST-MAIN');
  
  // Fix Google Cloud Master
  await fixServer('34.40.30.140', password, 'GCLOUD-MASTER');
}

run();
