const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Testing next start manually via SSH connection ---');
    const startRes = await ssh.execCommand('cd /var/www/escortvip && npm run start');
    console.log('Stdout:', startRes.stdout);
    console.log('Stderr:', startRes.stderr);
    console.log('Exit Code:', startRes.code);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
