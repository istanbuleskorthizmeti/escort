import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function killAndCleanMiner() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- KILLING SUSPICIOUS MINER PROCESS ---');
    const killResult = await ssh.execCommand('kill -9 3838005');
    console.log('KILL OUTPUT:', killResult.stdout || killResult.stderr || 'Killed (hopefully).');

    console.log('\n--- CLEANING MINER FILES ---');
    const cleanResult = await ssh.execCommand('rm -rf /usr/share/man/man3/.syslog-bdfd4e9f/');
    console.log('CLEAN OUTPUT:', cleanResult.stdout || cleanResult.stderr || 'Removed directory.');

    console.log('\n--- WAITING 5 SECONDS TO CHECK FOR RESTART ---');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n--- CHECKING ACTIVE PROCESSES FOR MINER ---');
    const check1 = await ssh.execCommand('ps aux | grep -i rsyslog');
    console.log(check1.stdout);

    console.log('\n--- WAITING another 10 SECONDS TO CHECK FOR RESTART ---');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n--- FINAL ACTIVE PROCESSES CHECK ---');
    const check2 = await ssh.execCommand('ps aux | grep -E "rsyslog|syslog|man3" | grep -v grep');
    console.log(check2.stdout || 'No matching processes found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

killAndCleanMiner();
