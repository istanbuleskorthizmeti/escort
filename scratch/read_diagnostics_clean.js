const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    
    const ps = await ssh.execCommand('ps aux --sort=-%cpu | head -n 30');
    const cron = await ssh.execCommand('crontab -l');
    const systemd = await ssh.execCommand('systemctl list-units --type=service | grep -E "gs-dbus|dbus|miner|cpu" || true');
    const dbusStatus = await ssh.execCommand('systemctl status gs-dbus.service || true');
    const weirdFiles = await ssh.execCommand('ls -la /usr/bin/gs-dbus /lib/systemd/system/gs-dbus.service /var/tmp/ /tmp/ || true');

    const log = `
=== CPU PROCESSES ===
${ps.stdout}

=== CRONTAB ===
${cron.stdout || cron.stderr}

=== SYSTEMD UNITS ===
${systemd.stdout}

=== GS-DBUS STATUS ===
${dbusStatus.stdout || dbusStatus.stderr}

=== WEIRD FILES ===
${weirdFiles.stdout || weirdFiles.stderr}
`;

    fs.writeFileSync('scratch/diagnose_output.txt', log);
    console.log('Diagnostics written to scratch/diagnose_output.txt');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
