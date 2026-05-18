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
    
    console.log('📡 SEARCHING FOR CEREN IN CLIENT CHUNKS:');
    const result = await ssh.execCommand('grep -rn "Ceren" /root/esc/.next/static/chunks/ || echo "Not found in static chunks"');
    console.log(result.stdout.slice(0, 1000) || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
