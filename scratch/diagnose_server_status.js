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
    console.log('=== PM2 STATUS ===');
    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout || pm2Status.stderr);

    console.log('\n=== PM2 LOGS (escortvip) ===');
    const pm2Logs = await ssh.execCommand('pm2 logs escortvip --no-color --lines 30');
    console.log(pm2Logs.stdout || pm2Logs.stderr);

    console.log('\n=== CURL LOCALHOST:3000 ===');
    const curlLocal = await ssh.execCommand('curl -i http://localhost:3000/');
    console.log(curlLocal.stdout || curlLocal.stderr);

    console.log('\n=== NGINX STATUS & SYSTEMD ===');
    const nginxStatus = await ssh.execCommand('systemctl status nginx --no-pager');
    console.log(nginxStatus.stdout || nginxStatus.stderr);

    console.log('\n=== NGINX ERROR LOGS ===');
    const nginxLogs = await ssh.execCommand('tail -n 25 /var/log/nginx/error.log');
    console.log(nginxLogs.stdout || nginxLogs.stderr);

    console.log('\n=== PORTS LISTENING ===');
    const ports = await ssh.execCommand('ss -tulpn');
    console.log(ports.stdout || ports.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
