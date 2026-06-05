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
    console.log('=== LAST 100 LINES OF escortvip-error.log ===');
    const errLog = await ssh.execCommand('tail -n 100 /root/.pm2/logs/escortvip-error.log');
    console.log(errLog.stdout || errLog.stderr);

    console.log('\n=== LAST 100 LINES OF escortvip-out.log ===');
    const outLog = await ssh.execCommand('tail -n 100 /root/.pm2/logs/escortvip-out.log');
    console.log(outLog.stdout || outLog.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
