import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchOtherDbs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Searching for other databases and docker containers...');
    
    // 1. Docker check
    const docker = await ssh.execCommand('docker ps').catch(() => ({stdout: 'No Docker found.'}));
    console.log('--- DOCKER ---');
    console.log(docker.stdout);

    // 2. List all DBs with sudo
    const dbs = await ssh.execCommand('sudo -u postgres psql -l');
    console.log('\n--- ALL DATABASES ---');
    console.log(dbs.stdout);

    // 3. Check SQL file size again to be sure
    const sqlFile = await ssh.execCommand('ls -lh /var/www/escortvip/vuc2026.sql');
    console.log('\n--- SQL FILE ---');
    console.log(sqlFile.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchOtherDbs();
