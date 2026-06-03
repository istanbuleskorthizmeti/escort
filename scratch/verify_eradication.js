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

    console.log('--- Eradication Verification System ---');

    console.log('\n1. Checking active CPU processes (Top 10):');
    const psRes = await ssh.execCommand('ps aux --sort=-%cpu | head -n 11');
    console.log(psRes.stdout);

    console.log('\n2. Verifying if any malware files or binaries still exist:');
    const fileChecks = [
      '/crn2TksL',
      '/root/rapid_suppress.sh',
      '/etc/ld.so.preload',
      '/etc/data/libsystem.so',
      '/tmp/lrt',
      '/tmp/let',
      '/var/tmp/.sys-2f3cbe98/kworker',
      '/root/.xmrig/kworker',
      '/usr/sbin/multipathd',
      '/sbin/multipathd',
      '/etc/sudoers.d/99-pakchoi',
      '/etc/cron.d/syscheck'
    ];
    for (const f of fileChecks) {
      const res = await ssh.execCommand(`ls -ld "${f}" 2>/dev/null || echo "Not Found"`);
      console.log(`  - ${f}: ${res.stdout.trim()}`);
    }

    console.log('\n3. Verifying preloaded rootkit in memory of the new shell session:');
    const mapsRes = await ssh.execCommand('cat /proc/self/maps | grep -E "libsystem|data|let|lrt|xmrig" || echo "Clear"');
    console.log('  Memory preloads:', mapsRes.stdout.trim());

    console.log('\n4. Verifying if backdoor user hydra_secure is deleted:');
    const passwdCheck = await ssh.execCommand('grep -E "hydra_secure|pakchoi" /etc/passwd || echo "No backdoor users found"');
    console.log('  Passwd check:', passwdCheck.stdout.trim());

    console.log('\n5. Checking active network connections on port 9009 or nc:');
    const connections = await ssh.execCommand('ss -apn | grep -E "nc|9009|crn2" || echo "Clear"');
    console.log('  Malicious connections:', connections.stdout.trim());

    console.log('\n6. Checking PM2 Process List and application status:');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout);

    console.log('\nVerification complete!');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
