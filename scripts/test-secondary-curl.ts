import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '45.93.137.164',
      port: 22,
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to secondary server.');

    const res = await ssh.execCommand('ls -la /var/www/escortvip/public/sitemap-readme.xml /var/www/escortvip/public/feed-readme.xml');
    console.log('\n📋 File status:\n', res.stdout || res.stderr);

  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
