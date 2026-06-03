import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkConfig() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- ECOSYSTEM.CONFIG.JS ---');
    const eco = await ssh.execCommand('cat ecosystem.config.js');
    console.log(eco.stdout);

    console.log('\n--- ACTIVE PORTS (NETSTAT) ---');
    const netstat = await ssh.execCommand('ss -tulpn');
    console.log(netstat.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkConfig();
