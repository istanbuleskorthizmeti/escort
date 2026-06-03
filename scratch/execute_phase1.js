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

    console.log('--- Phase 1: Neutralizing Watchdog & Miners ---');
    
    console.log('1. Deleting rapid_suppress.sh script so it cannot restart...');
    const rmRes = await ssh.execCommand('rm -f /root/rapid_suppress.sh && touch /root/rapid_suppress.sh && chmod -x /root/rapid_suppress.sh');
    console.log('rm script:', rmRes.stdout || rmRes.stderr || 'done');

    console.log('2. Killing known watchdog and miner processes...');
    // Kill PIDs directly to avoid walking /proc
    const killRes = await ssh.execCommand('kill -9 2334063 2427574 3670662 || true');
    console.log('kill PIDs:', killRes.stdout || killRes.stderr || 'done');

    console.log('3. Stopping services using systemctl --no-block...');
    await ssh.execCommand('systemctl stop --no-block hydra-suppressor.service kworker.service sys-health.timer sys-health.service || true');
    await ssh.execCommand('systemctl disable hydra-suppressor.service kworker.service sys-health.timer sys-health.service || true');

    console.log('4. Stopping session scope...');
    await ssh.execCommand('systemctl stop --no-block session-21110.scope || true');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
