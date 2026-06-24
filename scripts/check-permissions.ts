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

    // 1. Check directory permissions
    const statDir = await ssh.execCommand('ls -la /var/www');
    console.log('--- /var/www LIST ---');
    console.log(statDir.stdout || statDir.stderr);

    const statApp = await ssh.execCommand('ls -la /var/www/escortvip');
    console.log('--- /var/www/escortvip LIST ---');
    console.log(statApp.stdout || statApp.stderr);

    // 2. Test access as www-data user
    const wwwAccess = await ssh.execCommand('sudo -u www-data head -n 1 /var/www/escortvip/.next/static/css/5e5a9d027d10ede1.css');
    console.log('--- www-data access test ---');
    console.log(wwwAccess.stdout || wwwAccess.stderr || 'Success (read file)');

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
