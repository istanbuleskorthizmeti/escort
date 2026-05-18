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
    
    console.log('🚨 [EMERGENCY] Terminating all runaway headless Chrome/Chromium processes...');
    const result1 = await ssh.execCommand('pkill -9 -f chrome || killall -9 chrome');
    console.log('Chrome Kill Result:', result1.stdout || result1.stderr || 'Done');

    const result2 = await ssh.execCommand('pkill -9 -f chromium || killall -9 chromium');
    console.log('Chromium Kill Result:', result2.stdout || result2.stderr || 'Done');

    console.log('🧹 Purging Linux kernel page caches...');
    await ssh.execCommand('sync && echo 3 > /proc/sys/vm/drop_caches');

    console.log('📡 NEW MEMORY STATS:');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
