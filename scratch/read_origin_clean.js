const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    const ppidRes = await ssh.execCommand('ps -o ppid,cmd -p $(pgrep -f crn2TksL)');
    const statusRes = await ssh.execCommand('cat /proc/$(pgrep -f crn2TksL)/status | grep -i ppid');
    const systemdRes = await ssh.execCommand('systemctl status $(pgrep -f crn2TksL) || true');
    const systemdServices = await ssh.execCommand('ls -la /etc/systemd/system/ | grep -v symlink || true');
    const systemdServicesContent = await ssh.execCommand('cat /etc/systemd/system/kworker.service /etc/systemd/system/sys-health.service /etc/systemd/system/hydra-suppressor.service || true');

    const log = `
=== PPID ===
${ppidRes.stdout}

=== PPID STATUS ===
${statusRes.stdout}

=== SYSTEMD SYSTEMCTL STATUS ===
${systemdRes.stdout}

=== SYSTEMD DIRECTORY ===
${systemdServices.stdout}

=== SYSTEMD FILES CONTENT ===
${systemdServicesContent.stdout || systemdServicesContent.stderr}
`;

    fs.writeFileSync('scratch/malware_origin.txt', log);
    console.log('Saved to scratch/malware_origin.txt');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
