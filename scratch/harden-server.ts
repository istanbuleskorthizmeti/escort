import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function hardenServer() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛡️ Hardening Server Security...');
    
    // 1. Check if fail2ban is installed
    const f2b = await ssh.execCommand('fail2ban-client version').catch(() => ({stdout: ''}));
    if (!f2b.stdout) {
      console.log('📦 Installing fail2ban...');
      await ssh.execCommand('apt-get update && apt-get install -y fail2ban');
    } else {
      console.log('✅ fail2ban already installed.');
    }

    // 2. Configure UFW
    console.log('🔥 Configuring UFW (Firewall)...');
    await ssh.execCommand('ufw allow 22/tcp');
    await ssh.execCommand('ufw allow 80/tcp');
    await ssh.execCommand('ufw allow 443/tcp');
    await ssh.execCommand('ufw allow 3001/tcp');
    await ssh.execCommand('echo "y" | ufw enable');
    console.log('✅ UFW enabled with strict rules.');

    // 3. Check for any hidden backdoors in /etc/rc.local or similar
    const rclocal = await ssh.execCommand('cat /etc/rc.local').catch(() => ({stdout: ''}));
    if (rclocal.stdout) {
      console.log('--- /etc/rc.local ---');
      console.log(rclocal.stdout);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

hardenServer();
