import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');
    const res = await ssh.execCommand('cat /var/www/serpbear/data/settings.json');
    console.log('--- SETTINGS CONTENT ---');
    console.log(res.stdout || res.stderr);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
