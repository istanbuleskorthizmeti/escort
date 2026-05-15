import { NodeSSH } from 'node-ssh';

const server = { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function checkAttackLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Checking Attack Server Logs (187.77.111.203)...');
    
    const logs = await ssh.execCommand('pm2 logs elite-gist-autopilot --lines 50 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(logs.stdout || logs.stderr);
    
    const env = await ssh.execCommand('ls -la /root/elite-autopilot'); // Assuming this path
    console.log('--- DIR STRUCTURE ---');
    console.log(env.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkAttackLogs();
