import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';

const oldSSH = new NodeSSH();
const newSSH = new NodeSSH();

const oldConfig = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const newConfig = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🛠️ [DATABASE & REDIS FIXER] Starting database dump, transfer, restore & Redis installation...');
  console.log('-----------------------------------------------------------------------------------------');

  try {
    // 1. Connect to both servers
    console.log(`📡 Connecting to Old Server (${oldConfig.host})...`);
    await oldSSH.connect(oldConfig);
    console.log('✅ Connected to Old Server.');

    console.log(`📡 Connecting to New Server (${newConfig.host})...`);
    await newSSH.connect(newConfig);
    console.log('✅ Connected to New Server.');

    // 2. Install Redis on the new server
    console.log('\n⚙️ Installing Redis Server on the new VPS...');
    const redisInstall = await newSSH.execCommand('apt-get update && apt-get install -y redis-server');
    console.log('   • Starting Redis Service...');
    await newSSH.execCommand('systemctl start redis-server && systemctl enable redis-server');
    const redisCheck = await newSSH.execCommand('systemctl is-active redis-server');
    console.log('   ℹ️ Redis Service Status:', redisCheck.stdout.trim());

    // 3. Generate a fresh database dump on the old server
    console.log('\n💾 Generating PostgreSQL dump from Docker vuc2026-db container on old server...');
    // Check if the container exists
    const containerCheck = await oldSSH.execCommand('docker ps --filter name=vuc2026-db -q');
    if (!containerCheck.stdout.trim()) {
      console.log('   ⚠️ Docker container vuc2026-db not found. Let us try direct pg_dump...');
      const dumpRes = await oldSSH.execCommand('PGPASSWORD=vuc2026_pass pg_dump -U vuc2026_user -d vuc2026 -h 127.0.0.1 -F c -b -v -f /tmp/vuc2026_backup.dump');
      console.log('   • pg_dump output:', dumpRes.stderr || dumpRes.stdout);
    } else {
      console.log('   • Container vuc2026-db is running. Dumping inside Docker...');
      await oldSSH.execCommand('docker exec -t vuc2026-db pg_dump -U vuc2026_user -d vuc2026 -F c -b -v -f /tmp/vuc2026_backup.dump');
      console.log('   • Copying dump out of Docker container...');
      await oldSSH.execCommand('docker cp vuc2026-db:/tmp/vuc2026_backup.dump /tmp/vuc2026_backup.dump');
    }

    // 4. Download the dump to local scratch folder
    const localDumpPath = path.join(process.cwd(), 'scratch', 'vuc2026_backup.dump');
    console.log(`\n📥 Downloading database dump to local: ${localDumpPath}`);
    if (fs.existsSync(localDumpPath)) {
      fs.unlinkSync(localDumpPath);
    }
    await oldSSH.getFile(localDumpPath, '/tmp/vuc2026_backup.dump');
    console.log(`   ✔ Downloaded size: ${fs.statSync(localDumpPath).size} bytes.`);

    // 5. Upload the dump to the new server
    console.log(`\n📤 Uploading database dump to new server...`);
    await newSSH.putFile(localDumpPath, '/tmp/vuc2026_backup.dump');
    console.log('   ✔ Uploaded.');

    // 6. Restore the database on the new server
    console.log('\n🗑️ Dropping and recreating public schema on new server to clean up...');
    await newSSH.execCommand(`sudo -u postgres psql -d vuc2026 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO vuc2026_user; ALTER SCHEMA public OWNER TO vuc2026_user;"`);

    console.log('⚡ Restoring database via pg_restore...');
    const restoreRes = await newSSH.execCommand(
      'PGPASSWORD=vuc2026_pass pg_restore -U vuc2026_user -d vuc2026 -h 127.0.0.1 --no-owner --role=vuc2026_user -v /tmp/vuc2026_backup.dump'
    );
    console.log('   ℹ️ pg_restore response:', restoreRes.stdout || restoreRes.stderr || 'No output.');

    // 7. Verify relations
    console.log('\n🔎 Verifying tables in the new Postgres database...');
    const verifyRes = await newSSH.execCommand(`PGPASSWORD=vuc2026_pass psql -U vuc2026_user -d vuc2026 -h 127.0.0.1 -c "\\dt"`);
    console.log(verifyRes.stdout || verifyRes.stderr);

    // 8. Re-run prisma generate and deploy migrations if needed
    console.log('\n⚙️ Re-generating Prisma Client and checking schema alignment...');
    await newSSH.execCommand('npx prisma generate', { cwd: '/var/www/escortvip' });
    const prismaPushRes = await newSSH.execCommand('npx prisma db push --skip-generate', { cwd: '/var/www/escortvip' });
    console.log('   Prisma Push response:', prismaPushRes.stdout || prismaPushRes.stderr);

    // 9. Restart PM2 app process
    console.log('\n🔄 Restarting Next.js process in PM2...');
    const restartRes = await newSSH.execCommand('pm2 restart esc-live');
    console.log(restartRes.stdout || restartRes.stderr);

    console.log('\n🏆 [SUCCESS] Database and Redis are fully fixed and PM2 process is restarted!');

  } catch (err: any) {
    console.error('Error during execution:', err.message);
  } finally {
    oldSSH.dispose();
    newSSH.dispose();
  }
}

main();
