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

    const res = await ssh.execCommand('cat /etc/nginx/sites-enabled/* || cat /etc/nginx/nginx.conf');
    console.log('\n📋 Nginx Config Output:\n', res.stdout || res.stderr);

  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
