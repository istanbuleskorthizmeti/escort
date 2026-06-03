const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Hardening Reconnaissance ---');

    console.log('\n1. Checking if apt works and updating package lists:');
    const aptRes = await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt-get update -y');
    console.log('  apt-get update status:', aptRes.code === 0 ? 'Success' : 'Failed', aptRes.stderr || '');

    console.log('\n2. Checking existing firewall tools:');
    const ufwCheck = await ssh.execCommand('which ufw iptables nftables');
    console.log('  Available firewalls:\n', ufwCheck.stdout || 'None');

    console.log('\n3. Checking current mount options for /tmp and /var/tmp:');
    const mountCheck = await ssh.execCommand('mount | grep -E "temp|tmp"');
    console.log(mountCheck.stdout);

    console.log('\n4. Checking authorized SSH keys:');
    const sshKeys = await ssh.execCommand('cat /root/.ssh/authorized_keys || echo "No authorized_keys"');
    console.log(sshKeys.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
