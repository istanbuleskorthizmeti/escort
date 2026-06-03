import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function viewRemoteUtils() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOTE utils.ts (LINES 15-25) ---');
    const content = await ssh.execCommand('sed -n "15,25p" /root/esc/lib/utils.ts');
    console.log(content.stdout || content.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Diagnostic script failed:', err);
    ssh.dispose();
  }
}

viewRemoteUtils();
