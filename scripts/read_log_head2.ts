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

    console.log('📖 --- FIRST 50 LINES OF LOG ---');
    const headRes = await ssh.execCommand('head -n 50 /root/esc/shortener.log');
    console.log(headRes.stdout || headRes.stderr || 'No log output');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
