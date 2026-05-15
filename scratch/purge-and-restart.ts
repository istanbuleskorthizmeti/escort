import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    console.log('\n--- PURGING PORT 3001 ---');
    // Use fuser or kill with lsof to free the port
    await ssh.execCommand('fuser -k 3001/tcp || (lsof -t -i:3001 | xargs kill -9) || true');
    
    console.log('\n--- RESTARTING HYDRA-WEB ---');
    const res = await ssh.execCommand('pm2 restart hydra-web');
    console.log(res.stdout);
    
    console.log('\n--- VERIFYING PORT ---');
    const netRes = await ssh.execCommand('ss -tulpn | grep 3001');
    console.log(netRes.stdout || 'Port 3001 is NOT listening yet (waiting for startup)...');

    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
