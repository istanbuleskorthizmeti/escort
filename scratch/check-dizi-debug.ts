import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function checkDiziDebug() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Checking Dizi Server Debug Info...');
    
    const logs = await ssh.execCommand('pm2 logs dizicehennemi-web --lines 50 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(logs.stdout || logs.stderr);
    
    const net = await ssh.execCommand('netstat -tpln');
    console.log('--- PORTS ---');
    console.log(net.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkDiziDebug();
