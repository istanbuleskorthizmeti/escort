import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkShm() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /dev/shm ---');
    const lsRes = await ssh.execCommand('ls -la /dev/shm');
    console.log(lsRes.stdout || lsRes.stderr || 'Empty');

    console.log('\n--- DF -H /dev/shm ---');
    const dfRes = await ssh.execCommand('df -h /dev/shm');
    console.log(dfRes.stdout || dfRes.stderr);

    console.log('\n--- POSTGRESQL RUNNING PROCESS DETAILS ---');
    const psRes = await ssh.execCommand('ps -ef | grep postgres');
    console.log(psRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkShm();
