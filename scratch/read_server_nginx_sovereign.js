const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading sovereign-hydra.conf ---');
    const catRes = await ssh.execCommand('cat /etc/nginx/sites-enabled/sovereign-hydra.conf');
    console.log(catRes.stdout || catRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
