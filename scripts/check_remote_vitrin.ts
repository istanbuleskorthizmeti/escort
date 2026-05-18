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
    
    console.log('📡 REMOTE VITRIN IMAGES CONTENT:');
    const result = await ssh.execCommand('cat /root/esc/lib/vitrin-images.ts | head -n 80 | tail -n 50');
    console.log(result.stdout || result.stderr || 'No output');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
