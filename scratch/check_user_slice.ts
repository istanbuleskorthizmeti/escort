import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkUserSlice() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMCTL STATUS USER-0.SLICE ---');
    const status = await ssh.execCommand('systemctl status user-0.slice');
    console.log(status.stdout || status.stderr);

    console.log('\n--- SYSTEMCTL SHOW USER-0.SLICE ---');
    const show = await ssh.execCommand('systemctl show user-0.slice | grep -i -E "memory|tasks|cpu"');
    console.log(show.stdout || show.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkUserSlice();
