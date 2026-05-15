import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkEscortLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Checking Escort Server Logs (hydra-web)...');
    
    const logs = await ssh.execCommand('pm2 logs hydra-web --lines 100 --nostream');
    console.log(logs.stdout || logs.stderr);
    
    const net = await ssh.execCommand('netstat -tpln');
    console.log('--- NETWORK PORTS ---');
    console.log(net.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkEscortLogs();
