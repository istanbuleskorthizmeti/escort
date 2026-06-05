const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Reading /var/www/escortvip/package.json...');
    const res = await ssh.execCommand('cat /var/www/escortvip/package.json');
    console.log(res.stdout || res.stderr || 'Not found');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
