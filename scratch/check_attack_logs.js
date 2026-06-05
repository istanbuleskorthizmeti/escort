const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Fetching logs for escortvip PM2 process...');
    const logsRes = await ssh.execCommand('pm2 logs escortvip --lines 40 --raw --err');
    console.log(logsRes.stdout || logsRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
