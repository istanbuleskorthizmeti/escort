import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function listRemoteModules() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /ROOT/ESC/NODE_MODULES/ ---');
    const result = await ssh.execCommand('ls -la /root/esc/node_modules/ 2>/dev/null || echo "node_modules not found"');
    console.log(result.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

listRemoteModules();
