import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkNext() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /root/esc/.next/ ---');
    const res = await ssh.execCommand('ls -la /root/esc/.next/');
    console.log(res.stdout || res.stderr);

    console.log('\n--- FILE CONTENTS OF BUILD-ID ---');
    const idRes = await ssh.execCommand('cat /root/esc/.next/BUILD_ID');
    console.log('BUILD_ID:', idRes.stdout || idRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkNext();
