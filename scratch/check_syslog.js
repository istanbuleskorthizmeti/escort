const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking dmesg for OOM kills ---');
    const dmesgRes = await ssh.execCommand('dmesg -T | grep -i -E "oom|kill|out of memory" | tail -n 20');
    console.log(dmesgRes.stdout || dmesgRes.stderr || 'No OOM entries in dmesg.');

    console.log('--- checking syslog for OOM kills ---');
    const syslogRes = await ssh.execCommand('grep -i -E "oom|kill|out of memory" /var/log/syslog /var/log/messages 2>/dev/null | tail -n 20');
    console.log(syslogRes.stdout || syslogRes.stderr || 'No OOM entries in syslog.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
