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

    const files = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/');
    console.log('--- SITES ENABLED ---');
    console.log(files.stdout || files.stderr);

    const config = await ssh.execCommand('cat /etc/nginx/sites-enabled/*');
    console.log('--- CONFIG CONTENT ---');
    console.log(config.stdout || config.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
