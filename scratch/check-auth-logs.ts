import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkAuthLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking SSH Auth Logs...');
    
    const logs = await ssh.execCommand('grep "Accepted" /var/log/auth.log | tail -n 20');
    console.log('--- SUCCESSFUL LOGINS ---');
    console.log(logs.stdout || 'No logs found or file inaccessible.');
    
    const attempts = await ssh.execCommand('grep "Failed password" /var/log/auth.log | tail -n 20');
    console.log('\n--- FAILED ATTEMPTS ---');
    console.log(attempts.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkAuthLogs();
