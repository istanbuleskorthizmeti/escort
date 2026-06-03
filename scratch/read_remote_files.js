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

    console.log('=== Reading /root/rapid_suppress.sh ===');
    const res1 = await ssh.execCommand('cat /root/rapid_suppress.sh');
    console.log(res1.stdout || res1.stderr);

    console.log('=== Listing / directory for weird files ===');
    const res2 = await ssh.execCommand('ls -la / | grep -E "crn|Tks|let|lrt" || ls -la /');
    console.log(res2.stdout || res2.stderr);

    console.log('=== Checking process info for /crn2TksL ===');
    const res3 = await ssh.execCommand('ls -la /crn2TksL || true');
    console.log(res3.stdout || res3.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
