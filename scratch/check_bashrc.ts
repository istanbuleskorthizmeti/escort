import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkBashrc() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- /ROOT/.BASHRC ---');
    const bashrc = await ssh.execCommand('tail -n 30 /root/.bashrc');
    console.log(bashrc.stdout);

    console.log('\n--- /ROOT/.PROFILE ---');
    const profile = await ssh.execCommand('cat /root/.profile 2>/dev/null || echo "No .profile"');
    console.log(profile.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkBashrc();
