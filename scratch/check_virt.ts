import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkVirtualization() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMD DETECT VIRTUALIZATION ---');
    const virtRes = await ssh.execCommand('systemd-detect-virt');
    console.log('Virt Type:', virtRes.stdout.trim() || virtRes.stderr.trim());

    console.log('\n--- CAT /PROC/USER_BEANCOUNTERS ---');
    const ubcRes = await ssh.execCommand('cat /proc/user_beancounters 2>/dev/null');
    console.log(ubcRes.stdout || 'OpenVZ user_beancounters not found (Standard KVM/LXC VM)');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkVirtualization();
