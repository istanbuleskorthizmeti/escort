import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function psqlTest() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📡 [ESCORT] Testing direct psql connection with PGPASSWORD...');
    
    const cmd = `PGPASSWORD='DorukElite2026Secure' psql -h localhost -U vuc2026_user -d vuc2026 -c "SELECT 1;"`;
    const res = await ssh.execCommand(cmd);
    console.log('--- STDOUT ---');
    console.log(res.stdout);
    console.log('--- STDERR ---');
    console.log(res.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

psqlTest();
