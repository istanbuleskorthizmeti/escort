import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function dbFix() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔐 [ESCORT] Resetting vuc2026_user password...');
    
    // Using single quotes for the SQL command to avoid escaping issues
    const resetCmd = `sudo -u postgres psql -c "ALTER USER vuc2026_user WITH PASSWORD 'DorukElite2026Secure';"`;
    const res = await ssh.execCommand(resetCmd);
    console.log(res.stdout || res.stderr);

    console.log('✅ [ESCORT] Password reset! Retesting DB connection...');
    const testRes = await ssh.execCommand('npx tsx check_db.js', { cwd: '/root' });
    console.log(testRes.stdout || testRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

dbFix();
