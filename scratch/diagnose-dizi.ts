import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function diagnoseDizi() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Diagnosing Dizi Server (45.93.137.164)...');
    
    // 1. Get process info
    const status = await ssh.execCommand('pm2 show dizicehennemi-web');
    console.log('--- PM2 SHOW ---');
    console.log(status.stdout);

    // 2. Get error logs
    const logs = await ssh.execCommand('pm2 logs dizicehennemi-web --lines 50 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

diagnoseDizi();
