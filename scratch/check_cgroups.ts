import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkCgroups() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CGROUP V1 MEMORY LIMIT ---');
    const cg1 = await ssh.execCommand('cat /sys/fs/cgroup/memory/memory.limit_in_bytes');
    console.log(cg1.stdout || cg1.stderr);

    console.log('\n--- CGROUP V2 MEMORY LIMIT ---');
    const cg2 = await ssh.execCommand('cat /sys/fs/cgroup/memory.max');
    console.log(cg2.stdout || cg2.stderr);

    console.log('\n--- CGROUP CURRENT MEMORY USAGE ---');
    const cgUsage = await ssh.execCommand('cat /sys/fs/cgroup/memory.current 2>/dev/null || cat /sys/fs/cgroup/memory/memory.usage_in_bytes 2>/dev/null');
    console.log(cgUsage.stdout || cgUsage.stderr);

    console.log('\n--- DOCKER / CONTAINER CHECK ---');
    const dockerCheck = await ssh.execCommand('cat /proc/1/cgroup');
    console.log(dockerCheck.stdout || dockerCheck.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkCgroups();
