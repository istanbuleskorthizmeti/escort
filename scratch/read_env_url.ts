import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkEnvUrl() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOTE DATABASE_URL ---');
    const grepRes = await ssh.execCommand('grep DATABASE_URL /root/esc/.env');
    console.log(grepRes.stdout || grepRes.stderr || 'No DATABASE_URL line found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkEnvUrl();
