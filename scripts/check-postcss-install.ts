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

    const npmList = await ssh.execCommand('npm list tailwindcss postcss @tailwindcss/postcss', { cwd: '/var/www/escortvip' });
    console.log('--- NPM LIST OUTPUT ---');
    console.log(npmList.stdout || npmList.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
