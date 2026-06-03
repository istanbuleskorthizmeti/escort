import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSyslogHelper() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- EXECUTABLE PATH FOR SYSLOG-HELPER ---');
    const exe = await ssh.execCommand('ls -la /proc/3838038/exe');
    console.log(exe.stdout || exe.stderr);

    console.log('\n--- CMDLINE FOR SYSLOG-HELPER ---');
    const cmd = await ssh.execCommand('cat /proc/3838038/cmdline | tr "\\0" " "');
    console.log(cmd.stdout || cmd.stderr);

    console.log('\n--- SYSTEMD JOURNAL LOG FOR SYSLOG-HELPER ---');
    const journal = await ssh.execCommand('journalctl | grep -i syslog-helper | tail -n 20');
    console.log(journal.stdout || 'No journal logs found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSyslogHelper();
