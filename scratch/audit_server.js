const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function auditServer() {
  const config = {
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  };

  try {
    await ssh.connect(config);
    console.log('✅ Connected. Auditing server security status...');

    console.log('\n--- 1. High CPU / Running Processes ---');
    const psRes = await ssh.execCommand('ps aux --sort=-%cpu | head -n 25');
    console.log(psRes.stdout);

    console.log('\n--- 2. Active Network Ports & Connections ---');
    const netRes = await ssh.execCommand('ss -tulpn');
    console.log(netRes.stdout);

    console.log('\n--- 3. Crontab (Malware persistence check) ---');
    const cronRes = await ssh.execCommand('crontab -l');
    console.log('Root crontab:', cronRes.stdout || 'None');

    console.log('\n--- 4. Authorized Keys (Backdoor SSH keys) ---');
    const keysRes = await ssh.execCommand('cat /root/.ssh/authorized_keys');
    console.log(keysRes.stdout || 'Empty or No file');

    console.log('\n--- 5. PM2 Processes Status ---');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout || pm2Res.stderr);

    console.log('\n--- 6. PostgreSQL Status ---');
    const pgRes = await ssh.execCommand('systemctl status postgresql');
    console.log(pgRes.stdout || pgRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('❌ Audit failed:', err.message);
    ssh.dispose();
  }
}

auditServer();
