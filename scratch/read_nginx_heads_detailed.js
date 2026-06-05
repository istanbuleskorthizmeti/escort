const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Config: escortvip (first 35 lines) ---');
    const escortRes = await ssh.execCommand('head -n 35 /etc/nginx/sites-enabled/escortvip');
    console.log(escortRes.stdout);

    console.log('\n--- Config: sovereign-hydra.conf (first 35 lines) ---');
    const sovRes = await ssh.execCommand('head -n 35 /etc/nginx/sites-enabled/sovereign-hydra.conf');
    console.log(sovRes.stdout);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
