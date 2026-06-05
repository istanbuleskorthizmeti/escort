const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Listing app/ directory on Attack Server ---');
    const findRes = await ssh.execCommand('find /var/www/escortvip/app -maxdepth 3');
    console.log(findRes.stdout || findRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
