const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- check all processes ---');
    const procRes = await ssh.execCommand('ps aux | grep -i -E "escortvip|esc" | grep -v grep');
    console.log(procRes.stdout || procRes.stderr || 'No matching processes.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
