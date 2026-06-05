const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Memory info ---');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout || freeRes.stderr);

    console.log('--- CPU info ---');
    const cpuRes = await ssh.execCommand('lscpu | grep -E "Model name|CPU\\(s\\):"');
    console.log(cpuRes.stdout || cpuRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
