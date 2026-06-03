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

    console.log('--- Phase 3: Purging Malware Files & Rootkit ---');
    
    console.log('1. Deleting files from /tmp and /var/tmp...');
    await ssh.execCommand('rm -rf /tmp/lrt /tmp/let /tmp/.syslog-fallback || true');
    await ssh.execCommand('rm -rf /var/tmp/.sys-2f3cbe98 || true');

    console.log('2. Deleting xmrig files...');
    await ssh.execCommand('rm -rf /root/.xmrig || true');

    console.log('3. Deleting systemd unit files...');
    await ssh.execCommand('rm -f /etc/systemd/system/hydra-suppressor.service /etc/systemd/system/kworker.service /etc/systemd/system/sys-health.service /etc/systemd/system/sys-health.timer || true');

    console.log('4. Purging hijacked multipath-tools package...');
    const purgeRes = await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt-get purge -y multipath-tools || dpkg --purge multipath-tools || true');
    console.log('Purge output:', purgeRes.stdout || purgeRes.stderr);

    console.log('5. Sanitizing and locking down ld.so.preload...');
    await ssh.execCommand('chattr -ia /etc/ld.so.preload || true');
    await ssh.execCommand('echo "" > /etc/ld.so.preload');
    await ssh.execCommand('chattr +i /etc/ld.so.preload');

    console.log('6. Removing rootkit libsystem.so binary...');
    await ssh.execCommand('chattr -ia /etc/data/libsystem.so /etc/data || true');
    await ssh.execCommand('rm -rf /etc/data || true');

    console.log('Done with Phase 3!');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
