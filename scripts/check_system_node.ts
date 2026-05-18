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
    
    console.log('📡 Checking Node system paths & global node modules...');
    const result = await ssh.execCommand('which tsx || npx which tsx || true');
    console.log(result.stdout || result.stderr || 'No response');

    console.log('📡 Checking remote tsx execution with tsx command directly...');
    const res = await ssh.execCommand('npx tsx --version', { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
