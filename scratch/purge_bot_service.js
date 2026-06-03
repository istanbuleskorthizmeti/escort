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
    
    console.log('📡 Connected for third-stage malware purge...');

    const commands = [
      // 1. Stop and disable the bot.service miner hook
      'systemctl stop bot.service || true',
      'systemctl disable bot.service || true',
      
      // 2. Remove the immutable attributes on bot.service if any
      'chattr -i /usr/lib/systemd/system/bot.service || true',
      'chattr -i /etc/systemd/system/bot.service || true',
      
      // 3. Delete the configuration files
      'rm -f /usr/lib/systemd/system/bot.service',
      'rm -f /etc/systemd/system/bot.service',

      // 4. Force reload systemd
      'systemctl daemon-reload',
      
      // 5. Purge known Kinsing paths
      'rm -rf /etc/data',
      'rm -rf /etc/data/kinsing',
      'pkill -9 -f kinsing || true',
      'pkill -9 -f bot.service || true'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      console.log(res.stdout || res.stderr || 'Success');
    }

    console.log('✅ Remote bot.service miner persistent hook neutralized!');
  } catch (err) {
    console.error('❌ Purge Failed:', err);
  } finally {
    ssh.dispose();
  }
}

main();
