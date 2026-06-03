import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function locateEntrypoint() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FINDING ALL entrypoint.sh ON FILE SYSTEM ---');
    const findRes = await ssh.execCommand('find / -name "entrypoint.sh" 2>/dev/null');
    console.log(findRes.stdout || 'None found via find.');

    console.log('\n--- READING `/proc/3765522/fd` ---');
    const fdRes = await ssh.execCommand('ls -la /proc/3765522/fd/');
    console.log(fdRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

locateEntrypoint();
