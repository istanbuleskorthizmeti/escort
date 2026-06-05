const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('--- scripts/generate_dynamic_sitemap.js content ---');
    const res = await ssh.execCommand('cat /var/www/escortvip/scripts/generate_dynamic_sitemap.js');
    console.log(res.stdout || res.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
