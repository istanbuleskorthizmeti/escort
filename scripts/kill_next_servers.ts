import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('🚨 [EMERGENCY] Terminating all orphaned next-server processes...');
    const killResult = await ssh.execCommand('pkill -9 -f next-server || killall -9 next-server');
    console.log('Kill Result:', killResult.stdout || killResult.stderr || 'Done');

    console.log('🧹 Purging Linux kernel page caches...');
    await ssh.execCommand('sync && echo 3 > /proc/sys/vm/drop_caches');

    console.log('📡 RECOVERED MEMORY STATS:');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
