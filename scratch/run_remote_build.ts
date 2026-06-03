import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkBuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🏗️ Running npm run build on the server...');
    const result = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('\n--- STDOUT ---');
    console.log(result.stdout);
    console.log('\n--- STDERR ---');
    console.log(result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkBuild();
