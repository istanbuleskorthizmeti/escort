import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSelfCgroup() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CGROUP SELF LIMITS ---');
    const limit = await ssh.execCommand('cat /sys/fs/cgroup/self/memory.max 2>/dev/null || cat /sys/fs/cgroup/memory/memory.limit_in_bytes 2>/dev/null || echo "not found"');
    console.log('memory.max:', limit.stdout.trim());

    const current = await ssh.execCommand('cat /sys/fs/cgroup/self/memory.current 2>/dev/null || cat /sys/fs/cgroup/memory/memory.usage_in_bytes 2>/dev/null || echo "not found"');
    console.log('memory.current:', current.stdout.trim());

    console.log('\n--- SYSTEMD SYSTEM.CONF LIMITS ---');
    const sysd = await ssh.execCommand('grep -i -E "DefaultLimit" /etc/systemd/system.conf /etc/systemd/user.conf 2>/dev/null || echo "no limits config found"');
    console.log(sysd.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSelfCgroup();
