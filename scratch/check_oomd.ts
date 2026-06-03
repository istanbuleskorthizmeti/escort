import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkOomd() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- OOMD SERVICE STATUS ---');
    const status = await ssh.execCommand('systemctl status systemd-oomd');
    console.log(status.stdout || status.stderr);

    console.log('\n--- OOMD LOGS ---');
    const logs = await ssh.execCommand('journalctl -u systemd-oomd --no-pager | tail -n 50');
    console.log(logs.stdout || logs.stderr);

    console.log('\n--- SYSTEMD-OOMD KILL RECORDS ---');
    const kills = await ssh.execCommand('journalctl | grep -i oomd | tail -n 50');
    console.log(kills.stdout || kills.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkOomd();
