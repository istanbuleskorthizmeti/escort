import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkOldAuthLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking Older SSH Auth Logs...');
    
    // Check May 11 and early May 12
    const logs = await ssh.execCommand('grep "Accepted" /var/log/auth.log.1 /var/log/auth.log 2>/dev/null | grep "May 11\\|May 12" | head -n 100');
    console.log('--- LOGINS (May 11-12) ---');
    console.log(logs.stdout);
    
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkOldAuthLogs();
