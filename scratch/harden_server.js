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

    console.log('--- Hardening Phase 1: Firewall Configuration ---');
    
    // 1. Install ufw if missing
    console.log('Installing ufw...');
    const installRes = await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt-get install -y ufw');
    console.log('Install stdout:', installRes.stdout);
    
    // 2. Configure rules (allow SSH port 2222 first!)
    console.log('Configuring UFW rules...');
    await ssh.execCommand('ufw allow 2222/tcp');
    await ssh.execCommand('ufw allow 80/tcp');
    await ssh.execCommand('ufw allow 443/tcp');
    await ssh.execCommand('ufw default deny incoming');
    await ssh.execCommand('ufw default allow outgoing');
    
    // 3. Enable UFW
    console.log('Enabling UFW...');
    const enableRes = await ssh.execCommand('ufw --force enable');
    console.log('UFW status:', enableRes.stdout);

    console.log('\n--- Hardening Phase 2: Read /etc/fstab ---');
    const fstabRes = await ssh.execCommand('cat /etc/fstab');
    console.log('Fstab content:\n', fstabRes.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
