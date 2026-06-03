import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkFreeMemory() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FREE -H ---');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    console.log('\n--- SWAP STATUS ---');
    const swapRes = await ssh.execCommand('swapon --show');
    console.log(swapRes.stdout || 'No swap active!');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkFreeMemory();
