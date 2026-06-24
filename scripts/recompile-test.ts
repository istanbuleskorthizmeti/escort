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

    console.log('Running npm run build on the server...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('=== BUILD CODE ===', buildRes.code);
    console.log('=== BUILD STDOUT ===');
    console.log(buildRes.stdout);
    console.log('=== BUILD STDERR ===');
    console.log(buildRes.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
