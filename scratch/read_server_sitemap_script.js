const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading server generate_dynamic_sitemap.js ---');
    const catRes = await ssh.execCommand('cat /var/www/escortvip/scripts/generate_dynamic_sitemap.js');
    console.log(catRes.stdout || catRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
