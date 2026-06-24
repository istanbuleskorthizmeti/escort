import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    // 1. List Postgres tables
    const tableList = await ssh.execCommand(`PGPASSWORD=vuc2026_pass psql -U vuc2026_user -d vuc2026 -h 127.0.0.1 -c "\\dt"`);
    console.log('--- TABLE LIST ---');
    console.log(tableList.stdout || tableList.stderr || 'No output.');

    // 2. Check if redis-server is installed/running
    const redisStatus = await ssh.execCommand('systemctl status redis || systemctl status redis-server');
    console.log('--- REDIS STATUS ---');
    console.log(redisStatus.stdout || redisStatus.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
