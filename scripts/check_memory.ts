import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 MEMORY STATS:');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);
    
    console.log('📡 SWAP SPACE:');
    const swaponRes = await ssh.execCommand('swapon --show');
    console.log(swaponRes.stdout || 'None');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
