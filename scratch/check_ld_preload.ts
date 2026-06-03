import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkLdPreload() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- /ETC/LD.SO.PRELOAD CONTENT ---');
    const preload = await ssh.execCommand('cat /etc/ld.so.preload 2>/dev/null || echo "No preload file found"');
    console.log(preload.stdout.trim() || 'Preload file is empty');

    console.log('\n--- CHECKING FOR /ETC/DATA ---');
    const dataDir = await ssh.execCommand('ls -la /etc/data 2>/dev/null || echo "No /etc/data directory"');
    console.log(dataDir.stdout);

    console.log('\n--- CHECKING MAPS OF A SUSPICIOUS PROCESS (e.g. 4054165) ---');
    const maps = await ssh.execCommand('cat /proc/4054165/maps 2>/dev/null | grep -v -E "libc-|libm-|libpthread-|ld-" | head -n 40 || echo "Process not found or no access"');
    console.log(maps.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkLdPreload();
