import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function diagnose() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOTE /root/esc/app/amp CONTENTS ---');
    const lsRes = await ssh.execCommand('ls -la /root/esc/app/amp');
    console.log(lsRes.stdout || lsRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Diagnostic script failed:', err);
    ssh.dispose();
  }
}

diagnose();
