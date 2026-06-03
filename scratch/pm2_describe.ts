import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPm2Desc() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 DESCRIBE WEB CLUSTER ---');
    const desc = await ssh.execCommand('pm2 describe drkcnay-web-cluster');
    console.log(desc.stdout || desc.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPm2Desc();
