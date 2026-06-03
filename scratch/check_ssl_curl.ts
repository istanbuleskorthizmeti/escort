import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSSL() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CURL HTTPS HOME PAGE ---');
    const resHttps = await ssh.execCommand(
      'curl -I -k https://127.0.0.1/ -H "Host: istanbulescdrkcn.com"'
    );
    console.log(resHttps.stdout || resHttps.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSSL();
