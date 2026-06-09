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
    
    console.log('📡 Request 1: GET /api/seo/sitemap');
    const res1 = await ssh.execCommand('curl -i -H "Host: istanbulescort.blog" http://127.0.0.1:3001/api/seo/sitemap');
    console.log('STDOUT:', res1.stdout);
    console.log('STDERR:', res1.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
