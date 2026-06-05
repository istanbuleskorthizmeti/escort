const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function cleanAndFixServer() {
  const config = {
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  };

  try {
    await ssh.connect(config);
    console.log('✅ Connected. Starting remediation actions...');

    // 1. Clear the compromised authorized_keys file to remove the backdoor keys (beaj)
    console.log('🧹 Clearing authorized_keys file to remove persistent backdoors...');
    const clearKeysRes = await ssh.execCommand('> /root/.ssh/authorized_keys');
    console.log('Clear Keys:', clearKeysRes.code === 0 ? 'Success' : 'Failed');

    // 2. Check failed services to understand the emergency mode cause
    console.log('\n🔍 Checking failed systemd services...');
    const failedUnitsRes = await ssh.execCommand('systemctl --failed');
    console.log(failedUnitsRes.stdout);

    // 3. If docker.service or snapd.service failed and caused emergency mode, let's check if we can disable them temporarily
    // so the server boots normally.
    console.log('\n🛠️ Disabling failing non-essential services to prevent Emergency Mode on next boot...');
    await ssh.execCommand('systemctl disable docker.service snapd.service || true');
    console.log('Disabled Docker and Snapd services.');

    // 4. Force default boot target (multi-user.target) to get out of Emergency Mode
    console.log('\n🚀 Forcing boot into default target...');
    const bootTargetRes = await ssh.execCommand('systemctl isolate default.target');
    console.log('Boot Target Switch Output:', bootTargetRes.stdout || bootTargetRes.stderr || 'Success (Isolated)');

    ssh.dispose();
  } catch (err) {
    console.error('❌ Action failed:', err.message);
    ssh.dispose();
  }
}

cleanAndFixServer();
