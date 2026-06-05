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
    console.log('=== UFW BLOCK LOGS ===');
    const ufwLogs = await ssh.execCommand('grep -i "[UFW BLOCK]" /var/log/syslog | tail -n 50 || tail -n 50 /var/log/ufw.log');
    console.log(ufwLogs.stdout || ufwLogs.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
