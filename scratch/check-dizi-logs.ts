import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function checkDiziLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Checking Dizi Server Logs...');
    
    const logs = await ssh.execCommand('pm2 logs dizicehennemi-web --lines 50 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(logs.stdout || logs.stderr);
    
    const files = await ssh.execCommand('ls -la /var/www/escortvip'); // Wait, is it in /var/www/escortvip?
    console.log('--- FILES in /var/www/escortvip ---');
    console.log(files.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkDiziLogs();
