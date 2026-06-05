const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading first 50 lines of generate_dynamic_sitemap.js ---');
    const headRes = await ssh.execCommand('head -n 50 /var/www/escortvip/scripts/generate_dynamic_sitemap.js');
    console.log(headRes.stdout || headRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
