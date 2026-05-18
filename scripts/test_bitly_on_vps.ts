import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🚀 Running test_bitly_tokens.js on VPS...');
    const execRes = await ssh.execCommand('node scripts/test_bitly_tokens.js', { cwd: '/root/esc' });
    console.log('STDOUT:', execRes.stdout);
    console.log('STDERR:', execRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
