import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSessionLimits() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CURRENT SCOPE INFO ---');
    const scope = await ssh.execCommand('cat /proc/self/cgroup');
    console.log(scope.stdout);

    const cgroupPath = scope.stdout.split('\n')[0].split(':/')[1];
    if (cgroupPath) {
      console.log('\n--- CGROUP LIMITS ---');
      const maxMem = await ssh.execCommand(`cat /sys/fs/cgroup/${cgroupPath}/memory.max 2>/dev/null || echo "not found"`);
      console.log('memory.max:', maxMem.stdout.trim());
      const currentMem = await ssh.execCommand(`cat /sys/fs/cgroup/${cgroupPath}/memory.current 2>/dev/null || echo "not found"`);
      console.log('memory.current:', currentMem.stdout.trim());
    }

    console.log('\n--- SSHD SYSTEMD SERVICE LIMITS ---');
    const sshdShow = await ssh.execCommand('systemctl show ssh.service || systemctl show sshd.service');
    console.log(sshdShow.stdout.split('\n').filter(line => line.includes('Memory') || line.includes('Tasks') || line.includes('CPU')).join('\n'));

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSessionLimits();
