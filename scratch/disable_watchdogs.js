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

    console.log('--- Kill watchdog processes directly first ---');
    // Using kill -9 on parent and children bash processes running rapid_suppress.sh
    const pkillRes = await ssh.execCommand('pkill -9 -f rapid_suppress.sh || killall -9 rapid_suppress.sh || true');
    console.log('Kill results:', pkillRes.stdout || pkillRes.stderr);

    console.log('--- Force empty ld.so.preload and make it unwriteable ---');
    // Stop rootkit preloader immediately so new processes don't load it
    await ssh.execCommand('echo "" > /etc/ld.so.preload && chattr +i /etc/ld.so.preload || true');

    console.log('--- Stop services using systemctl --no-block ---');
    // systemctl stop normally waits for the service to end, which can hang if watchdog loops are blocked or if systemd is wedged
    // --no-block sends the request and returns immediately
    const services = ['hydra-suppressor.service', 'kworker.service', 'sys-health.timer', 'sys-health.service'];
    for (const service of services) {
      console.log(`Disabling ${service}...`);
      await ssh.execCommand(`systemctl disable ${service} || true`);
      console.log(`Stopping ${service} (--no-block)...`);
      await ssh.execCommand(`systemctl stop --no-block ${service} || true`);
    }

    console.log('--- Stop session-21110.scope cgroup (--no-block) ---');
    await ssh.execCommand('systemctl stop --no-block session-21110.scope || true');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
