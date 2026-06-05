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
    console.log('=== NGINX ERROR LOGS ===');
    const nginxError = await ssh.execCommand('tail -n 50 /var/log/nginx/error.log');
    console.log(nginxError.stdout || nginxError.stderr);

    console.log('\n=== NGINX ACCESS LOGS ===');
    const nginxAccess = await ssh.execCommand('tail -n 50 /var/log/nginx/access.log');
    console.log(nginxAccess.stdout || nginxAccess.stderr);

    console.log('\n=== CURL 127.0.0.1:3000 (timeout 5s) ===');
    const curlLocal = await ssh.execCommand('curl -I --max-time 5 http://127.0.0.1:3000/');
    console.log(curlLocal.stdout || curlLocal.stderr);

    console.log('\n=== CURL 127.0.0.1:3000 with Host istanbulescdrkcn.com (timeout 5s) ===');
    const curlHost = await ssh.execCommand('curl -I --max-time 5 -H "Host: istanbulescdrkcn.com" http://127.0.0.1:3000/');
    console.log(curlHost.stdout || curlHost.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
