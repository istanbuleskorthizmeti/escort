const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking port 3000 while manual start runs ---');
    const netRes = await ssh.execCommand('netstat -lntp | grep :3000');
    console.log(netRes.stdout || 'Nothing listening on port 3000.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
