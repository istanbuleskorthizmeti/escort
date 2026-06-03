import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function readDeleted() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- READING DELETED SCRIPT CONTENT FROM PROC FD ---');
    const scriptContent = await ssh.execCommand('cat /proc/3765522/fd/10');
    console.log(scriptContent.stdout || scriptContent.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

readDeleted();
