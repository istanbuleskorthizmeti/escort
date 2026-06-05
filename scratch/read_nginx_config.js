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
    console.log('=== NGINX CONF.D / SITES-ENABLED ===');
    const sites = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/ /etc/nginx/conf.d/');
    console.log(sites.stdout || sites.stderr);

    console.log('\n=== CONTENT OF ACTIVE NGINX CONFIGS ===');
    const activeConfigs = await ssh.execCommand('cat /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*');
    console.log(activeConfigs.stdout || activeConfigs.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
