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
    console.log('🚀 [PM2] Starting escortvip...');
    const startRes = await ssh.execCommand('pm2 start escortvip');
    console.log(startRes.stdout || startRes.stderr);

    console.log('\n⏳ Waiting 5 seconds for application startup...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('\n📄 [PM2] Checking status...');
    const listRes = await ssh.execCommand('pm2 status escortvip');
    console.log(listRes.stdout || listRes.stderr);

    console.log('\n📄 [PM2] Checking recent output logs...');
    const outLogRes = await ssh.execCommand('tail -n 25 /root/.pm2/logs/escortvip-out.log');
    console.log(outLogRes.stdout || outLogRes.stderr);

    console.log('\n📄 [PM2] Checking recent error logs...');
    const errLogRes = await ssh.execCommand('tail -n 25 /root/.pm2/logs/escortvip-error.log');
    console.log(errLogRes.stdout || errLogRes.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
