const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- escortvip-error.log ---');
    const errRes = await ssh.execCommand('tail -n 50 /root/.pm2/logs/escortvip-error.log');
    console.log(errRes.stdout || errRes.stderr || 'No error logs found.');

    console.log('--- escortvip-out.log ---');
    const outRes = await ssh.execCommand('tail -n 50 /root/.pm2/logs/escortvip-out.log');
    console.log(outRes.stdout || outRes.stderr || 'No output logs found.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
