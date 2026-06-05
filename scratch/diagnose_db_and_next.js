const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('=== PG ISREADY ===');
    const pgReady = await ssh.execCommand('pg_isready');
    console.log(pgReady.stdout || pgReady.stderr);

    console.log('\n=== DB CONNECTION TEST ===');
    const dbTest = await ssh.execCommand('PGPASSWORD=vuc2026_pass psql -h localhost -U vuc2026_user -d vuc2026 -c "SELECT count(*) FROM \\"Site\\";"');
    console.log(dbTest.stdout || dbTest.stderr);

    console.log('\n=== CPU & MEMORY USAGE ===');
    const resourceUsage = await ssh.execCommand('ps aux --sort=-%cpu | head -n 15');
    console.log(resourceUsage.stdout || resourceUsage.stderr);

    console.log('\n=== NETSTAT POSTGRES ===');
    const netstatPg = await ssh.execCommand('netstat -lntp | grep 5432');
    console.log(netstatPg.stdout || netstatPg.stderr);

    console.log('\n=== REDIS STATUS ===');
    const redisStatus = await ssh.execCommand('systemctl status redis-server --no-pager || service redis status || ps aux | grep redis');
    console.log(redisStatus.stdout || redisStatus.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
