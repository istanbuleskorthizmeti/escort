import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkLfd() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CSF / LFD STATUS ---');
    const csf = await ssh.execCommand('systemctl status csf || systemctl status lfd || ps aux | grep -E "csf|lfd"');
    console.log(csf.stdout || csf.stderr);

    console.log('\n--- LFD LOGS ---');
    const logs = await ssh.execCommand('tail -n 50 /var/log/lfd.log 2>/dev/null || echo "No lfd.log found"');
    console.log(logs.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkLfd();
