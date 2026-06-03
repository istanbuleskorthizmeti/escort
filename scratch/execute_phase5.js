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

    console.log('--- Phase 5: SSH Daemon & System Recovery ---');
    
    console.log('1. Cleaning up /sbin/multipathd leftovers...');
    await ssh.execCommand('chattr -ia /sbin/multipathd/* /sbin/multipathd 2>/dev/null || true');
    const rmLeftRes = await ssh.execCommand('rm -rf /sbin/multipathd || true');
    console.log('Cleanup result:', rmLeftRes.stdout || rmLeftRes.stderr || 'done');

    console.log('2. Reloading systemd daemon config...');
    await ssh.execCommand('systemctl daemon-reload');

    console.log('3. Restarting SSH service to unload rootkit from process memory...');
    const sshRestart = await ssh.execCommand('systemctl restart ssh || systemctl restart sshd || /etc/init.d/ssh restart || true');
    console.log('SSH restart output:', sshRestart.stdout || sshRestart.stderr || 'done');

    console.log('Done with Phase 5!');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
