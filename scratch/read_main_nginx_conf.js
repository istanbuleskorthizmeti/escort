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
    console.log('=== NGINX.CONF ===');
    const nginxConf = await ssh.execCommand('cat /etc/nginx/nginx.conf');
    console.log(nginxConf.stdout || nginxConf.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
