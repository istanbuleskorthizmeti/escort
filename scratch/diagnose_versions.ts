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

    console.log('\n--- ROOT DIRECTORY (.swc, .babel, etc) ---');
    const rootRes = await ssh.execCommand('find /root -maxdepth 2 -name ".*swc*" -o -name ".*babel*" -o -name "*babel*"');
    console.log(rootRes.stdout || 'None');

    console.log('\n--- ESC DIRECTORY HIDDEN FILES ---');
    const escRes = await ssh.execCommand('ls -la /root/esc');
    console.log(escRes.stdout || escRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Diagnostic script failed:', err);
    ssh.dispose();
  }
}

diagnose();
