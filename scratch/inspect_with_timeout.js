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

    console.log('=== Checking files with timeout ===');
    const files = [
      '/etc/cron.d/syscheck',
      '/etc/sudoers.d/99-pakchoi',
      '/etc/rc.local',
      '/etc/systemd/system/multipathd.service',
      '/etc/lrt',
      '/etc/data/libsystem.so',
      '/etc/ld.so.preload',
      '/root/rapid_suppress.sh',
      '/root/.xmrig/config.json',
      '/root/.xmrig/kworker',
      '/usr/sbin/multipathd',
      '/tmp/lrt',
      '/tmp/let',
      '/tmp/.syslog-fallback/syslog-ng-fallback'
    ];

    for (const f of files) {
      console.log(`\n--- file: ${f} ---`);
      
      // Check file type / details with timeout 2
      const lsRes = await ssh.execCommand(`timeout 2 ls -ld "${f}"`);
      console.log('  ls -ld:', lsRes.stdout.trim() || lsRes.stderr.trim() || '(timeout or empty)');

      // Cat file with timeout 2
      const catRes = await ssh.execCommand(`timeout 2 cat "${f}"`);
      console.log('  cat contents:\n', catRes.stdout.trim() || catRes.stderr.trim() || '(timeout or empty)');
    }

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
