const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading heads of Nginx config files ---');
    const headRes = await ssh.execCommand('head -n 50 /etc/nginx/sites-enabled/escortvip /etc/nginx/sites-enabled/sovereign-hydra.conf');
    console.log(headRes.stdout || headRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
