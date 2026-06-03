import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testWebpackBuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMD JOURNAL TAIL FOR SIGKILL PROCESSES ---');
    // Let's search journalctl specifically for the exact moment the build process gets killed.
    const logs = await ssh.execCommand('journalctl --since "5 minutes ago" --no-pager | grep -i -E "kill|out of memory|oom"');
    console.log(logs.stdout || 'No logs found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testWebpackBuild();
