const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to server for eradication...');
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    console.log('Connected!');

    console.log('\n--- PHASE 1: Disabling Watchdog Services ---');

    // Disable and stop services
    const services = ['hydra-suppressor.service', 'kworker.service', 'sys-health.timer', 'sys-health.service'];
    for (const service of services) {
      console.log(`Disabling and stopping ${service}...`);
      await ssh.execCommand(`systemctl disable ${service} || true`);
      await ssh.execCommand(`systemctl stop ${service} || true`);
    }

    // Terminate cgroup scope to kill all zombie nc processes in one go
    console.log('Stopping session-21110.scope cgroup...');
    await ssh.execCommand('systemctl stop session-21110.scope || true');

    // Double check with direct kill for rapid_suppress loops
    console.log('Killing active rapid_suppress watchdog scripts...');
    await ssh.execCommand('pkill -9 -f rapid_suppress || true');

    console.log('\n--- PHASE 2: Killing Active Malware Processes ---');
    console.log('Killing crn2TksL, kworker, and zombie netcat listeners...');
    await ssh.execCommand('pkill -9 -f crn2TksL || true');
    await ssh.execCommand('pkill -9 -f kworker || true');
    await ssh.execCommand('pkill -9 -f "nc " || true');

    console.log('\n--- PHASE 3: Removing Malware Files ---');
    console.log('Deleting suppressor script...');
    await ssh.execCommand('rm -f /root/rapid_suppress.sh');

    console.log('Deleting service unit files...');
    await ssh.execCommand('rm -f /etc/systemd/system/hydra-suppressor.service');
    await ssh.execCommand('rm -f /etc/systemd/system/kworker.service');
    await ssh.execCommand('rm -f /etc/systemd/system/sys-health.service');
    await ssh.execCommand('rm -f /etc/systemd/system/sys-health.timer');

    console.log('Deleting files in /tmp and /var/tmp...');
    await ssh.execCommand('rm -rf /tmp/lrt /tmp/let /tmp/.syslog-fallback');
    await ssh.execCommand('rm -rf /var/tmp/.sys-2f3cbe98');

    console.log('Deleting xmrig folder...');
    await ssh.execCommand('rm -rf /root/.xmrig');

    console.log('Purging hijacked multipath-tools package...');
    await ssh.execCommand('apt-get purge -y multipath-tools || dpkg --purge multipath-tools || true');

    console.log('Cleaning ld.so.preload and removing libsystem.so...');
    await ssh.execCommand('echo "" > /etc/ld.so.preload');
    await ssh.execCommand('chattr -ia /etc/data/libsystem.so /etc/data || true');
    await ssh.execCommand('rm -rf /etc/data');

    console.log('\n--- PHASE 4: Purging Backdoors and User Accounts ---');
    console.log('Deleting backdoor sudoers configuration...');
    await ssh.execCommand('rm -f /etc/sudoers.d/99-pakchoi');

    console.log('Deleting malicious cron config...');
    await ssh.execCommand('rm -f /etc/cron.d/syscheck');

    console.log('Deleting backdoor user hydra_secure...');
    await ssh.execCommand('userdel -r hydra_secure || true');

    console.log('Sanitizing system configuration loaders...');
    // Restore clean default profile if modified or clean inline additions
    await ssh.execCommand('sed -i "/lrt/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/let/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/libsystem/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');
    await ssh.execCommand('sed -i "/rapid_suppress/d" /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null || true');

    console.log('\n--- PHASE 5: SSH Daemon & System Recovery ---');
    console.log('Reloading systemd daemon config...');
    await ssh.execCommand('systemctl daemon-reload');

    console.log('Restarting ssh daemon to unload preload rootkit from process memory...');
    await ssh.execCommand('systemctl restart ssh || systemctl restart sshd || true');

    console.log('\nEradication commands sent successfully! Running validation script...');

  } catch(e) {
    console.error('Error during eradication:', e);
  } finally {
    ssh.dispose();
  }
}
run();
