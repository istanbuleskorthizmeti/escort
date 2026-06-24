import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('--- SERPBEAR CONTAINER DOCKER LOGS ---');
    const logs = await ssh.execCommand('docker logs --tail 100 serpbear-app');
    console.log(logs.stdout || logs.stderr || 'No container logs found');

    console.log('--- SQLITE FILE INFORMATION ---');
    const dbFileInfo = await ssh.execCommand('ls -la /var/www/serpbear/data/');
    console.log(dbFileInfo.stdout || dbFileInfo.stderr);

    console.log('--- TEST DB READABILITY ---');
    const dbTest = await ssh.execCommand('sqlite3 /var/www/serpbear/data/save.db "SELECT count(*) FROM domains;"');
    console.log('Domains Count:', dbTest.stdout.trim() || 'Error: ' + dbTest.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
