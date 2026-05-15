import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkConnections() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking active network connections...');
    
    const connections = await ssh.execCommand('netstat -antp | grep ESTABLISHED');
    console.log('--- ESTABLISHED CONNECTIONS ---');
    console.log(connections.stdout);
    
    const failedIps = await ssh.execCommand("grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -n 10");
    console.log('\n--- TOP FAILED ATTEMPT IPs ---');
    console.log(failedIps.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkConnections();
