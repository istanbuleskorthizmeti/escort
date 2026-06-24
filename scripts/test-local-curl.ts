import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      port: 22,
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to VPS.');

    const res = await ssh.execCommand('curl -H "Host: dorukcanay.digital" -I http://127.0.0.1/sitemap-readme.xml');
    console.log('\n📋 Curl Headers:\n', res.stdout);

    const resFeed = await ssh.execCommand('curl -H "Host: dorukcanay.digital" -I http://127.0.0.1/feed-readme.xml');
    console.log('\n📋 Feed Curl Headers:\n', resFeed.stdout);

  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
