import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function runInstallDebug() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RUNNING NPM INSTALL WITH LOGGING ---');
    const result = await ssh.execCommand('npm install --include=dev', { cwd: '/root/esc' });
    console.log('EXIT CODE:', result.code);
    console.log('SIGNAL:', result.signal);
    console.log('STDOUT:', result.stdout);
    console.log('STDERR:', result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

runInstallDebug();
