const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Checking UFW status on Attack Server ---');
    const ufwRes = await ssh.execCommand('ufw status verbose');
    console.log(ufwRes.stdout || ufwRes.stderr);

    console.log('--- Checking listening ports on Attack Server ---');
    const portsRes = await ssh.execCommand('ss -tuln');
    console.log(portsRes.stdout || portsRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
