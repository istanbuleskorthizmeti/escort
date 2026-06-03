const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    
    console.log('📡 Connected to remove immutable attributes and files...');

    const commands = [
      'chattr -i /etc/systemd/system/kworker.service || true',
      'chattr -i /etc/systemd/system/multipathd.service || true',
      'chattr -i /etc/cron.d/hydra-secure-backup || true',
      'rm -f /etc/systemd/system/kworker.service',
      'rm -f /etc/systemd/system/multipathd.service',
      'rm -f /etc/cron.d/hydra-secure-backup',
      'systemctl daemon-reload'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      console.log(res.stdout || res.stderr || 'Success');
    }

    console.log('✅ Immutable files cleaned successfully!');
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    ssh.dispose();
  }
}

main();
