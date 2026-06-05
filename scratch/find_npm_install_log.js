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
    console.log('--- checking recent npm log files ---');
    const logsRes = await ssh.execCommand('grep -l "install" /root/.npm/_logs/*.log || echo "None found"');
    console.log(logsRes.stdout);
    
    console.log('\n--- checking all recent logs ---');
    const lsRes = await ssh.execCommand('ls -lat /root/.npm/_logs/ | head -n 30');
    console.log(lsRes.stdout);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
