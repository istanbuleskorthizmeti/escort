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
    console.log('--- PM2 Logs (out) ---');
    const outRes = await ssh.execCommand('tail -n 30 /root/.pm2/logs/escortvip-out.log');
    console.log(outRes.stdout || outRes.stderr);

    console.log('\n--- PM2 Logs (error) ---');
    const errRes = await ssh.execCommand('tail -n 30 /root/.pm2/logs/escortvip-error.log');
    console.log(errRes.stdout || errRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
