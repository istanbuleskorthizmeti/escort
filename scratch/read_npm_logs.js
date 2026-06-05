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
    console.log('--- checking npm log directory ---');
    const logsRes = await ssh.execCommand('ls -la /root/.npm/_logs/ | tail -n 5');
    console.log(logsRes.stdout || logsRes.stderr);

    const latestLog = logsRes.stdout.trim().split('\n').map(l => {
      const parts = l.split(/\s+/);
      return parts[parts.length - 1];
    }).filter(f => f && f.endsWith('.log')).pop();

    if (latestLog) {
      console.log(`\n--- Reading latest log: ${latestLog} ---`);
      const catRes = await ssh.execCommand(`tail -n 30 /root/.npm/_logs/${latestLog}`);
      console.log(catRes.stdout);
    } else {
      console.log('No npm logs found.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
