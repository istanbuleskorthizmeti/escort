const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkAttackServer() {
  try {
    console.log('🚀 Connecting to new server (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('✅ Connected. Auditing environment...');
    
    const checks = [
      { name: 'OS', cmd: 'cat /etc/os-release | grep PRETTY_NAME' },
      { name: 'Node.js', cmd: 'node -v' },
      { name: 'PM2', cmd: 'pm2 -v' },
      { name: 'Disk Space', cmd: 'df -h /' },
      { name: 'Python', cmd: 'python3 --version' }
    ];

    for (const check of checks) {
      const result = await ssh.execCommand(check.cmd);
      console.log(`[${check.name}]: ${result.stdout.trim() || 'Not found'}`);
    }

    ssh.dispose();
  } catch (err) {
    console.error('❌ Error:', err);
    ssh.dispose();
  }
}

checkAttackServer();
