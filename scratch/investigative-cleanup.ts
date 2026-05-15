import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function investigativeCleanup() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Investigating suspicious files...');
    
    // 1. Check /etc/let
    const letDir = await ssh.execCommand('ls -la /etc/let');
    console.log('--- /etc/let ---');
    console.log(letDir.stdout || 'NOT A DIRECTORY');
    
    const letFile = await ssh.execCommand('cat /etc/let').catch(() => ({stdout: ''}));
    if (letFile.stdout) {
      console.log('--- /etc/let CONTENT ---');
      console.log(letFile.stdout.substring(0, 500));
    }

    // 2. Check for hidden cron jobs in cron.d
    console.log('\n--- HIDDEN CRON JOBS (/etc/cron.d) ---');
    const crond = await ssh.execCommand('ls -la /etc/cron.d/');
    console.log(crond.stdout);

    // 3. Check for suspicious services
    console.log('\n--- SUSPICIOUS SYSTEMD SERVICES ---');
    const services = await ssh.execCommand('systemctl list-units --type=service --state=running | grep -v "systemd\\|nginx\\|ssh\\|pm2"');
    console.log(services.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

investigativeCleanup();
