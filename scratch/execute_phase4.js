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

    console.log('--- Phase 4: Purging Backdoors, User Accounts, and Cron ---');
    
    console.log('1. Deleting backdoor sudoers file /etc/sudoers.d/99-pakchoi...');
    await ssh.execCommand('rm -f /etc/sudoers.d/99-pakchoi || true');

    console.log('2. Deleting custom malicious cron file /etc/cron.d/syscheck...');
    await ssh.execCommand('rm -f /etc/cron.d/syscheck || true');

    console.log('3. Deleting backdoor user account hydra_secure...');
    const userdelRes = await ssh.execCommand('userdel -r hydra_secure || true');
    console.log('userdel output:', userdelRes.stdout || userdelRes.stderr || 'done');

    console.log('4. Sanitizing shell profile configurations...');
    // Replace any occurrence of commands executing lrt or let or rapid_suppress in profile configurations
    await ssh.execCommand('sed -i "/lrt/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/let/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/libsystem/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/rapid_suppress/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');

    console.log('Done with Phase 4!');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
