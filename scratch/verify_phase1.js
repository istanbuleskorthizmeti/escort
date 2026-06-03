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

    console.log('--- Checking active CPU processes and services ---');
    const psRes = await ssh.execCommand('ps aux --sort=-%cpu | head -n 15');
    console.log('Top CPU:\n', psRes.stdout);

    const activeRes = await ssh.execCommand('ps -ef | grep -E "crn2TksL|rapid_suppress|nc |kworker" | grep -v grep || echo "None found!"');
    console.log('Active malware processes:\n', activeRes.stdout);

    const serviceRes = await ssh.execCommand('systemctl is-active hydra-suppressor.service kworker.service sys-health.timer sys-health.service || true');
    console.log('Services status:\n', serviceRes.stdout);

    const scopeRes = await ssh.execCommand('systemctl status session-21110.scope | head -n 10 || true');
    console.log('Session scope status:\n', scopeRes.stdout || scopeRes.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
