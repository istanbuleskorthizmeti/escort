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

    console.log('--- Phase 3.2: Recursively clearing remaining immutable files ---');
    // We run find to clear immutable attributes of any files under these directories and then remove them
    await ssh.execCommand('find /var/tmp/.sys-2f3cbe98 -type f -exec chattr -ia {} + 2>/dev/null || true');
    await ssh.execCommand('chattr -ia /var/tmp/.sys-2f3cbe98 || true');
    await ssh.execCommand('rm -rf /var/tmp/.sys-2f3cbe98 || true');

    await ssh.execCommand('find /root/.xmrig -type f -exec chattr -ia {} + 2>/dev/null || true');
    await ssh.execCommand('chattr -ia /root/.xmrig || true');
    await ssh.execCommand('rm -rf /root/.xmrig || true');

    console.log('--- Phase 4.2: Removing pakchoi backdoor user from configs ---');
    // Using sed to delete the lines matching user "pakchoi" in passwd/shadow/group/gshadow
    await ssh.execCommand('sed -i "/^pakchoi:/d" /etc/passwd || true');
    await ssh.execCommand('sed -i "/^pakchoi:/d" /etc/shadow || true');
    await ssh.execCommand('sed -i "/^pakchoi:/d" /etc/group || true');
    await ssh.execCommand('sed -i "/^pakchoi:/d" /etc/gshadow || true');

    console.log('--- Verification ---');
    console.log('1. Checking leftover files:');
    const filesCheck = await ssh.execCommand('ls -la /var/tmp/.sys-2f3cbe98 /root/.xmrig /etc/cron.d/syscheck 2>/dev/null || echo "All malware files deleted!"');
    console.log(filesCheck.stdout);

    console.log('2. Checking backdoor users:');
    const passwdCheck = await ssh.execCommand('grep -E "hydra_secure|pakchoi" /etc/passwd || echo "All backdoor accounts purged!"');
    console.log(passwdCheck.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
