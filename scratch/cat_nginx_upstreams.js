const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- escortvip config upstream/ports ---');
    const escRes = await ssh.execCommand('grep -A 10 -i "upstream" /etc/nginx/sites-available/escortvip');
    console.log(escRes.stdout || 'No upstream in escortvip');

    console.log('--- sovereign-hydra config upstream/ports ---');
    const hydraRes = await ssh.execCommand('grep -A 10 -i "upstream" /etc/nginx/sites-available/sovereign-hydra.conf');
    console.log(hydraRes.stdout || 'No upstream in sovereign-hydra.conf');

    console.log('--- grep "proxy_pass" to see where they go ---');
    const ppRes = await ssh.execCommand('grep -i "proxy_pass" /etc/nginx/sites-available/*');
    console.log(ppRes.stdout);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
