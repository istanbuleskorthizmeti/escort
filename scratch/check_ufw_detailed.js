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
    console.log('=== UFW STATUS DETAILED ===');
    const ufwStatus = await ssh.execCommand('ufw status verbose');
    console.log(ufwStatus.stdout || ufwStatus.stderr);

    console.log('\n=== UFW RULES LIST ===');
    const ufwRules = await ssh.execCommand('ufw status numbered');
    console.log(ufwRules.stdout || ufwRules.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
