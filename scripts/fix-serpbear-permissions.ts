import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🔧 [PERMISSIONS FIX] Setting open permissions on SerpBear data folder...');
  console.log('---------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Make directory writable by anyone
    await ssh.execCommand('mkdir -p /var/www/serpbear/data');
    await ssh.execCommand('chmod -R 777 /var/www/serpbear/data');
    console.log('   ✔ Permissions set to 777 on /var/www/serpbear/data');

    // 2. Restart container
    console.log(' • Restarting SerpBear container...');
    await ssh.execCommand('docker restart serpbear-app');
    console.log('   ✔ Container restarted.');

    // 3. Wait for initialization
    console.log(' • Waiting for database initialization (10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 4. Check files in directory
    console.log('\n--- 📁 CREATED FILES IN DATA DIR ---');
    const files = await ssh.execCommand('ls -la /var/www/serpbear/data/');
    console.log(files.stdout || files.stderr);

    // 5. Check container logs
    console.log('\n--- 📁 NEW CONTAINER LOGS ---');
    const logs = await ssh.execCommand('docker logs --tail 30 serpbear-app');
    console.log(logs.stdout || logs.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
