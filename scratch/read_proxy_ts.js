const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading /var/www/escortvip/proxy.ts ---');
    const catRes = await ssh.execCommand('cat /var/www/escortvip/proxy.ts');
    console.log(catRes.stdout);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
