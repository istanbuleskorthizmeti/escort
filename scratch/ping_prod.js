const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- ping 213.232.235.181 from Attack Server ---');
    const pingRes = await ssh.execCommand('ping -c 4 213.232.235.181');
    console.log(pingRes.stdout || pingRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
