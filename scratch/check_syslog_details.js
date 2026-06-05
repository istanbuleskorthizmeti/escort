const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking syslog for build PID 288465 / 291069 ---');
    const sysRes = await ssh.execCommand('grep -E "288465|291069" /var/log/syslog /var/log/messages 2>/dev/null || echo "No syslog matches"');
    console.log(sysRes.stdout || sysRes.stderr);

    console.log('--- checking dmesg ---');
    const dmesgRes = await ssh.execCommand('dmesg -T | tail -n 50');
    console.log(dmesgRes.stdout || dmesgRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
