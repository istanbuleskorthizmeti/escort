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
    
    console.log('📡 Checking system architecture & esbuild platform executable status...');
    const result = await ssh.execCommand('uname -a && node -p "process.arch"');
    console.log(result.stdout || result.stderr || 'No response');

    console.log('📡 Testing raw esbuild compiler binary directly...');
    const res = await ssh.execCommand('./node_modules/esbuild/bin/esbuild --version', { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
