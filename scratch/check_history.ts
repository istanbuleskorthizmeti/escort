import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkHistory() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LAST 50 LINES OF HISTORY ---');
    const histRes = await ssh.execCommand('tail -n 50 ~/.bash_history');
    console.log(histRes.stdout || histRes.stderr || 'No bash history found.');

    console.log('\n--- FINDING ALL EXECUTABLES CREATED RECENTLY IN PUBLIC ---');
    const findRes = await ssh.execCommand('find /root/esc/public -type f -mmin -120');
    console.log(findRes.stdout || 'No files created in last 2 hours.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkHistory();
