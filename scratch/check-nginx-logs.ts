import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkNginxLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Analyzing Nginx Access Logs for attacks...');
    
    // Look for suspicious keywords in access logs
    const attacks = await ssh.execCommand('grep -iE "shell|exec|eval|system|cmd|base64" /var/log/nginx/access.log | tail -n 20');
    console.log('--- POTENTIAL EXPLOIT ATTEMPTS ---');
    console.log(attacks.stdout || 'No obvious exploit attempts in recent logs.');

    // Look for high frequency POST requests
    const posts = await ssh.execCommand("awk '$9 ~ /POST/ {print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10");
    console.log('\n--- TOP POST REQUEST SOURCE IPs ---');
    console.log(posts.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkNginxLogs();
