import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function disinfect() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- 1. KILLING SUSPICIOUS DAEMONS AND MINERS ---');
    // Kill the daemon shell script process (PID 3765522)
    await ssh.execCommand('kill -9 3765522');
    // Kill the miner process (PID 3766362)
    await ssh.execCommand('kill -9 3766362');
    
    // Kill any other processes matching "javae" or "entrypoint.sh"
    await ssh.execCommand('pkill -9 -f javae');
    await ssh.execCommand('pkill -9 -f entrypoint.sh');
    console.log('✅ Processes killed.');

    console.log('\n--- 2. REMOVING MALWARE PAYLOADS AND CONFIGS ---');
    // Remove the source payload folder under .pm2 (which was recreating public/javae)
    const rmPm2 = await ssh.execCommand('rm -rf /root/esc/.pm2');
    console.log('Removed /root/esc/.pm2:', rmPm2.code === 0 ? 'SUCCESS' : 'FAILED/ALREADY REMOVED');

    // Remove the copied files in public directory
    await ssh.execCommand('rm -f /root/esc/public/javae');
    await ssh.execCommand('rm -f /root/esc/public/config.json');
    await ssh.execCommand('rm -f /root/esc/public/daemon.lock');
    await ssh.execCommand('rm -f /root/esc/daemon.log');
    await ssh.execCommand('rm -f /dev/shm/let');
    console.log('✅ Malicious files removed.');

    console.log('\n--- 3. VERIFYING PROCESS LIST AND CPU USAGE ---');
    const psRes = await ssh.execCommand('ps aux --sort=-pcpu | head -n 15');
    console.log(psRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

disinfect();
