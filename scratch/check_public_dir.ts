import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPublic() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA PUBLIC ---');
    const lsRes = await ssh.execCommand('ls -la /root/esc/public');
    console.log(lsRes.stdout);

    console.log('\n--- SYSTEMD SERVICE FILES CHECKING FOR JAVAE OR MINER ---');
    const services = await ssh.execCommand('grep -rn "javae" /etc/systemd/system/ 2>/dev/null');
    console.log(services.stdout || 'No systemd services reference javae.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPublic();
