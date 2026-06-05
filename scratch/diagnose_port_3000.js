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
    console.log('=== Checking port 3000 connectivity ===');
    const netstat = await ssh.execCommand('netstat -lntp | grep 3000');
    console.log(netstat.stdout || netstat.stderr);

    console.log('\n=== Checking if Next.js actually handles requests internally ===');
    const curl = await ssh.execCommand('curl -i -s http://127.0.0.1:3000/');
    console.log(curl.stdout || curl.stderr);

    console.log('\n=== Checking PM2 escortvip logs ===');
    const pm2Logs = await ssh.execCommand('pm2 logs escortvip --no-color --lines 50');
    console.log(pm2Logs.stdout || pm2Logs.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
