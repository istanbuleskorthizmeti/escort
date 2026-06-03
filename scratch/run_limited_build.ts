import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function runLimitedBuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RUNNING BUILD WITH MEMORY LIMIT ---');
    const result = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=1024" && npx next build', { cwd: '/root/esc' });
    console.log('STDOUT:', result.stdout);
    console.log('STDERR:', result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

runLimitedBuild();
