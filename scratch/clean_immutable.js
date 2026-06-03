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

    console.log('--- Eradicating stubborn immutable leftovers and backdoors ---');

    console.log('1. Cleaning up /var/tmp/.sys-2f3cbe98/kworker...');
    await ssh.execCommand('chattr -ia /var/tmp/.sys-2f3cbe98/kworker /var/tmp/.sys-2f3cbe98 2>/dev/null || true');
    await ssh.execCommand('rm -rf /var/tmp/.sys-2f3cbe98 || true');

    console.log('2. Cleaning up /root/.xmrig/kworker...');
    await ssh.execCommand('chattr -ia /root/.xmrig/kworker /root/.xmrig/config.json /root/.xmrig/.ct /root/.xmrig/xmrig-6.26.0 /root/.xmrig 2>/dev/null || true');
    await ssh.execCommand('rm -rf /root/.xmrig || true');

    console.log('3. Cleaning up /etc/cron.d/syscheck...');
    await ssh.execCommand('chattr -ia /etc/cron.d/syscheck 2>/dev/null || true');
    await ssh.execCommand('rm -f /etc/cron.d/syscheck || true');

    console.log('4. Removing immutable attribute from /etc/ld.so.preload...');
    await ssh.execCommand('chattr -ia /etc/ld.so.preload 2>/dev/null || true');

    console.log('5. Deleting backdoor user pakchoi...');
    const pakchoiDel = await ssh.execCommand('userdel -r pakchoi || true');
    console.log('userdel pakchoi:', pakchoiDel.stdout || pakchoiDel.stderr || 'done');

    console.log('6. Confirming clean status...');
    const cronCheck = await ssh.execCommand('ls -la /etc/cron.d/syscheck /var/tmp/.sys-2f3cbe98 /root/.xmrig 2>/dev/null || echo "Stubborn files are gone!"');
    console.log(cronCheck.stdout);

    const passwdCheck = await ssh.execCommand('grep -E "hydra_secure|pakchoi" /etc/passwd || echo "Backdoors are gone!"');
    console.log(passwdCheck.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
