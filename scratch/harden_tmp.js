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

    console.log('--- Hardening Phase 3: tmp / var_tmp mounts ---');

    // 1. Check if /tmp entries are already in /etc/fstab
    const fstabCheck = await ssh.execCommand('grep -E "/tmp|/var/tmp" /etc/fstab');
    if (fstabCheck.stdout) {
      console.log('/tmp entries already found in fstab, skipping append.');
    } else {
      console.log('Appending tmpfs mounts to /etc/fstab...');
      const appendCmd = `echo "tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev,size=2G 0 0" >> /etc/fstab && echo "tmpfs /var/tmp tmpfs defaults,noexec,nosuid,nodev,size=1G 0 0" >> /etc/fstab`;
      const appendRes = await ssh.execCommand(appendCmd);
      console.log('fstab append status:', appendRes.code === 0 ? 'Success' : 'Failed');
    }

    // 2. Perform active mounting
    console.log('Mounting /tmp and /var/tmp as tmpfs...');
    await ssh.execCommand('mount -t tmpfs -o noexec,nosuid,nodev,size=2G tmpfs /tmp');
    await ssh.execCommand('mount -t tmpfs -o noexec,nosuid,nodev,size=1G tmpfs /var/tmp');

    // 3. Verify mounts
    const verifyMounts = await ssh.execCommand('mount | grep -E "/tmp|/var/tmp"');
    console.log('Active mounts:\n', verifyMounts.stdout);

    // 4. Test execution blocking in /tmp
    console.log('Testing execution blocking in /tmp...');
    await ssh.execCommand('echo "#!/bin/sh" > /tmp/test-exec.sh && echo "echo \'EXECUTION ALLOWED\'" >> /tmp/test-exec.sh && chmod +x /tmp/test-exec.sh');
    const runTest = await ssh.execCommand('/tmp/test-exec.sh');
    console.log('Execution result (expected to fail/denied):');
    console.log('  Exit Code:', runTest.code);
    console.log('  Stdout:', runTest.stdout);
    console.log('  Stderr:', runTest.stderr);

    // Clean up test file
    await ssh.execCommand('rm -f /tmp/test-exec.sh');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
