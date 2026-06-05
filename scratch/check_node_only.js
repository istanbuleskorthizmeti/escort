const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking all node processes ---');
    const psRes = await ssh.execCommand('ps aux | grep node | grep -v grep');
    console.log(psRes.stdout || psRes.stderr || 'No node processes.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
