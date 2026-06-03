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

    console.log('=== 1. Checking /etc/systemd/system/multipathd.service ===');
    const multipathRes = await ssh.execCommand('cat /etc/systemd/system/multipathd.service || cat /lib/systemd/system/multipathd.service');
    console.log(multipathRes.stdout || multipathRes.stderr);

    console.log('\n=== 2. Checking /root/.xmrig/ ===');
    const xmrigRes = await ssh.execCommand('ls -la /root/.xmrig/ /root/.xmrig/config.json || true');
    console.log(xmrigRes.stdout || xmrigRes.stderr);

    console.log('\n=== 3. Checking Docker containers ===');
    const dockerRes = await ssh.execCommand('docker ps -a || echo "no docker"');
    console.log(dockerRes.stdout || dockerRes.stderr);

    console.log('\n=== 4. Checking recent system files changed in the last 7 days ===');
    const findRes = await ssh.execCommand('find /etc /usr/bin /usr/sbin /bin /sbin -mtime -7 -type f 2>/dev/null | grep -v -E "resolv.conf|ld.so.cache|adjtime" | head -n 30 || true');
    console.log(findRes.stdout || findRes.stderr);

    console.log('\n=== 5. Checking for other large files in /tmp and /var/tmp ===');
    const tmpFiles = await ssh.execCommand('find /tmp /var/tmp -maxdepth 3 -type f -size +100k -exec ls -la {} + 2>/dev/null || true');
    console.log(tmpFiles.stdout || tmpFiles.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
