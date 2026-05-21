const { NodeSSH } = require('node-ssh');
require('dotenv').config();

const ssh = new NodeSSH();

async function run() {
  const host = process.env.SSH_HOST || '213.232.235.181';
  const username = process.env.SSH_USER || 'root';
  const password = process.env.SSH_PASSWORD || '4TVuj7qiHMfh7CxH6K!';

  console.log(`Connecting to primary VPS: ${host} to stop background content generation...`);
  try {
    await ssh.connect({ host, username, password });
    console.log('✅ Connected.');

    // 1. PM2 stop background workers
    console.log('\n--- 1. STOPPING PM2 BACKGROUND WORKERS ---');
    const stopPM2 = await ssh.execCommand('pm2 stop hydra-auto-index hydra-audit-watcher');
    console.log(stopPM2.stdout || stopPM2.stderr || 'No output.');

    // 2. Kill standalone tsx processes
    console.log('\n--- 2. KILLING STANDALONE TSX PROCESSES ---');
    const killTSX = await ssh.execCommand('pkill -f tsx');
    console.log(killTSX.stdout || killTSX.stderr || 'No TSX processes found / Killed successfully.');

    // 3. Restart PostgreSQL database to clear pool locks
    console.log('\n--- 3. RESTARTING POSTGRESQL DATABASE ---');
    const restartDb = await ssh.execCommand('systemctl restart postgresql');
    console.log(restartDb.stdout || restartDb.stderr || 'PostgreSQL restarted.');

    // 4. Restart Next.js Web cluster
    console.log('\n--- 4. RESTARTING NEXT.JS WEB APP ---');
    const restartWeb = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log(restartWeb.stdout || restartWeb.stderr || 'Next.js web app restarted.');

    // 5. Final Status check
    console.log('\n--- 5. FINAL PM2 STATUS ---');
    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout || pm2Status.stderr);

  } catch (err) {
    console.error('🚨 Error connecting or running recovery commands:', err);
  } finally {
    ssh.dispose();
  }
}

run();
