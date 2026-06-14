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
    console.log('=== NGINX SYSTEMD STATUS ===');
    const nginxStatus = await ssh.execCommand('systemctl status nginx --no-pager');
    console.log(nginxStatus.stdout || nginxStatus.stderr);

    console.log('\n=== CURL PORT 80 LOCAL ===');
    const curl80 = await ssh.execCommand('curl -I --max-time 5 -H "Host: istanbulescort.blog" http://127.0.0.1:80/');
    console.log(curl80.stdout || curl80.stderr);

    console.log('\n=== CURL PORT 443 LOCAL ===');
    const curl443 = await ssh.execCommand('curl -I -k --max-time 5 -H "Host: istanbulescort.blog" https://127.0.0.1:443/');
    console.log(curl443.stdout || curl443.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
