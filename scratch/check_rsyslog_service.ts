import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkRsyslogService() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RSYSLOG.SERVICE CONTENT ---');
    const result = await ssh.execCommand('cat /usr/lib/systemd/system/rsyslog.service || cat /lib/systemd/system/rsyslog.service');
    console.log(result.stdout || result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkRsyslogService();
