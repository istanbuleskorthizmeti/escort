import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function traceEntrypoint() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LOCATING `entrypoint.sh` CWD ---');
    const cwdRes = await ssh.execCommand('ls -l /proc/3765522/cwd');
    console.log(cwdRes.stdout || cwdRes.stderr);

    console.log('\n--- LOCATING ALL `entrypoint.sh` FILES ON SERVER ---');
    const findRes = await ssh.execCommand('find / -name "entrypoint.sh" 2>/dev/null');
    console.log(findRes.stdout || 'None found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

traceEntrypoint();
