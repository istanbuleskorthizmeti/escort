import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkParent() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    const ppidRes = await ssh.execCommand('ps -o ppid= -p 3766362');
    const ppid = ppidRes.stdout.trim();
    console.log(`Parent PID: ${ppid}`);

    if (ppid) {
      const parentRes = await ssh.execCommand(`ps -f -p ${ppid}`);
      console.log(parentRes.stdout || parentRes.stderr);
    }

    console.log('\n--- CHECKING SYSTEMD FOR RECENTLY CREATED SERVICE FILES ---');
    const serviceFiles = await ssh.execCommand('ls -la /etc/systemd/system/multi-user.target.wants/ /lib/systemd/system/');
    // Find files created recently
    console.log(serviceFiles.stdout.substring(0, 1000));

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkParent();
