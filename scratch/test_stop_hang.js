const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('Stopping hydra-suppressor.service with timeout...');
    const stopRes = await ssh.execCommand('timeout 5 systemctl stop hydra-suppressor.service || echo "failed stop"');
    console.log('Stop result:', stopRes.stdout || stopRes.stderr);

    console.log('Disabling hydra-suppressor.service...');
    const disableRes = await ssh.execCommand('systemctl disable hydra-suppressor.service || echo "failed disable"');
    console.log('Disable result:', disableRes.stdout || disableRes.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
