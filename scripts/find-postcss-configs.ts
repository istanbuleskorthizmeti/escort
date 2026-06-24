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

    const findConfigs = await ssh.execCommand('find /var/www/escortvip/ -maxdepth 2 -name "*postcss*"');
    console.log('--- POSTCSS FILES ---');
    console.log(findConfigs.stdout || findConfigs.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
