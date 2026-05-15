import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function forensicAudit() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Forensic Audit Started...');
    
    // 1. Check for persistent cron jobs
    console.log('\n--- CRON JOBS ---');
    const cron = await ssh.execCommand('crontab -l');
    console.log(cron.stdout || 'No user crontab.');
    const sysCron = await ssh.execCommand('cat /etc/crontab');
    console.log(sysCron.stdout);

    // 2. Check SSH Authorized Keys
    console.log('\n--- AUTHORIZED KEYS ---');
    const keys = await ssh.execCommand('cat ~/.ssh/authorized_keys');
    console.log(keys.stdout || 'No authorized keys.');

    // 3. Check for recently modified suspicious files in /tmp and /etc
    console.log('\n--- RECENTLY MODIFIED SYSTEM FILES ---');
    const modified = await ssh.execCommand('find /etc /tmp /var/tmp -mtime -2 -type f 2>/dev/null | head -n 20');
    console.log(modified.stdout);

    // 4. Check for open ports that shouldn't be there
    console.log('\n--- LISTENING PORTS ---');
    const ports = await ssh.execCommand('netstat -tpln');
    console.log(ports.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

forensicAudit();
