import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPm2() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SLEEPING 5 SECONDS TO ALLOW BOOTSTRAP ---');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n--- PM2 STATUS ---');
    const status = await ssh.execCommand('pm2 status');
    console.log(status.stdout);

    console.log('\n--- CURL LOCALHOST:8081 STATUS ---');
    const curl = await ssh.execCommand('curl -I http://127.0.0.1:8081/ || curl -I http://localhost:8081/');
    console.log(curl.stdout || curl.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPm2();
