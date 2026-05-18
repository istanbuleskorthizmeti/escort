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
    
    console.log('📡 NEXT.JS ROUTES MANIFEST REWRITES:');
    const manifest = await ssh.execCommand('cat /root/esc/.next/routes-manifest.json');
    const data = JSON.parse(manifest.stdout);
    console.log('Rewrites:', JSON.stringify(data.rewrites, null, 2));

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
