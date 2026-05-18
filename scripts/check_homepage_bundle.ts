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
    
    console.log('📡 HOMEPAGE BUNDLE CONTENT:');
    const result = await ssh.execCommand('grep -rn "Melissa" /root/esc/.next/server/app/page.js || echo "Not found in page.js"');
    console.log(result.stdout.slice(0, 1000) || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
