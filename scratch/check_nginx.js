const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Nginx Sites-Enabled on Attack Server ---');
    const sitesRes = await ssh.execCommand('ls -la /etc/nginx/sites-enabled');
    console.log(sitesRes.stdout || sitesRes.stderr);

    console.log('--- Reading config files ---');
    const catRes = await ssh.execCommand('cat /etc/nginx/sites-enabled/*');
    console.log(catRes.stdout || catRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
