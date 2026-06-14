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
    console.log('=== CURLING NEXT.JS (localhost:3000) ===');
    const nextRes = await ssh.execCommand('curl -I -H "Host: istanbulescort.blog" http://127.0.0.1:3000/');
    console.log(nextRes.stdout || nextRes.stderr);

    console.log('=== CURLING NGINX (localhost:80) ===');
    const nginxRes = await ssh.execCommand('curl -I -H "Host: istanbulescort.blog" http://127.0.0.1/');
    console.log(nginxRes.stdout || nginxRes.stderr);

    console.log('=== PM2 STATUS ===');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout || pm2Res.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
