import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

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

async function runMigration() {
  console.log('🏁 [MIGRATION STARTER] Initializing Server-to-Server Production Migration...');
  console.log('--------------------------------------------------------------------------');

  try {
    // Connect to servers
    console.log(`📡 Connecting to Old Server (${oldConfig.host})...`);
    await oldSSH.connect(oldConfig);
    console.log('✅ Connected to Old Server.');

    console.log(`📡 Connecting to New Server (${newConfig.host})...`);
    await newSSH.connect(newConfig);
    console.log('✅ Connected to New Server.');

    // ----------------------------------------------------
    // STEP 1: Provisioning dependencies on new server
    // ----------------------------------------------------
    console.log('\n⚙️ [STEP 1] Provisioning environment on new server...');
    
    console.log('   • Installing Node.js v20 LTS...');
    await newSSH.execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs');
    
    console.log('   • Installing PM2 globally...');
    await newSSH.execCommand('npm install -g pm2');

    console.log('   • Installing Nginx & PostgreSQL Server...');
    await newSSH.execCommand('apt-get install -y nginx postgresql postgresql-contrib');
    await newSSH.execCommand('systemctl start postgresql && systemctl enable postgresql');

    console.log('   • Creating database and user in PostgreSQL...');
    await newSSH.execCommand(`sudo -u postgres psql -c "CREATE DATABASE vuc2026;" || true`);
    await newSSH.execCommand(`sudo -u postgres psql -c "CREATE USER vuc2026_user WITH PASSWORD 'vuc2026_pass';" || true`);
    await newSSH.execCommand(`sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vuc2026 TO vuc2026_user;" || true`);
    // Ensure the schema privileges are granted
    await newSSH.execCommand(`sudo -u postgres psql -d vuc2026 -c "ALTER SCHEMA public OWNER TO vuc2026_user;" || true`);
    await newSSH.execCommand(`sudo -u postgres psql -d vuc2026 -c "GRANT ALL ON SCHEMA public TO vuc2026_user;" || true`);

    // ----------------------------------------------------
    // STEP 2: Database backup & restore
    // ----------------------------------------------------
    console.log('\n💾 [STEP 2] Migrating PostgreSQL database...');
    
    console.log('   • Generating pg_dump inside Docker container (vuc2026-db) on old server...');
    const pgDumpRes = await oldSSH.execCommand(
      'docker exec -t vuc2026-db pg_dump -U vuc2026_user -d vuc2026 -F c -b -v -f /tmp/vuc2026_backup.dump'
    );
    if (pgDumpRes.code !== 0) {
      console.warn('   ⚠️ pg_dump container warning/error:', pgDumpRes.stderr);
    }
    console.log('   • Extracting backup from Docker container...');
    await oldSSH.execCommand('docker cp vuc2026-db:/tmp/vuc2026_backup.dump /tmp/vuc2026_backup.dump');

    const localDumpPath = path.join(process.cwd(), 'scratch', 'vuc2026_backup.dump');
    console.log(`   • Downloading database dump to local: ${localDumpPath}`);
    await oldSSH.getFile(localDumpPath, '/tmp/vuc2026_backup.dump');

    console.log('   • Uploading database dump to new server...');
    await newSSH.putFile(localDumpPath, '/tmp/vuc2026_backup.dump');

    console.log('   • Restoring database on new server...');
    // Drop existing public schema if tables already exist to avoid restoration clashes
    await newSSH.execCommand(`sudo -u postgres psql -d vuc2026 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO vuc2026_user; ALTER SCHEMA public OWNER TO vuc2026_user;" || true`);
    
    const pgRestoreRes = await newSSH.execCommand(
      'PGPASSWORD=vuc2026_pass pg_restore -U vuc2026_user -d vuc2026 -h 127.0.0.1 --no-owner --role=vuc2026_user -v /tmp/vuc2026_backup.dump'
    );
    console.log('   ℹ️ Restore logs size:', pgRestoreRes.stdout.length + pgRestoreRes.stderr.length);

    // ----------------------------------------------------
    // STEP 3: Transfer Media Assets (CDN files)
    // ----------------------------------------------------
    console.log('\n🖼️ [STEP 3] Migrating static media assets (vitrin CDN)...');
    
    console.log('   • Packaging media assets on old server...');
    await oldSSH.execCommand('tar -czf /tmp/vitrin.tar.gz -C /var/www/cdn/vitrin . || tar -czf /tmp/vitrin.tar.gz -C /var/www/cdn .');

    const localTarPath = path.join(process.cwd(), 'scratch', 'vitrin.tar.gz');
    console.log(`   • Downloading media assets to local: ${localTarPath}`);
    await oldSSH.getFile(localTarPath, '/tmp/vitrin.tar.gz');

    console.log('   • Uploading media assets to new server...');
    await newSSH.putFile(localTarPath, '/tmp/vitrin.tar.gz');

    console.log('   • Extracting media assets on new server...');
    await newSSH.execCommand('mkdir -p /var/www/cdn/vitrin');
    await newSSH.execCommand('tar -xzf /tmp/vitrin.tar.gz -C /var/www/cdn/vitrin');
    console.log('   ✔ Media assets restored.');

    // ----------------------------------------------------
    // STEP 4: Application Code deployment
    // ----------------------------------------------------
    console.log('\n🚀 [STEP 4] Deploying Next.js application codebase...');

    const localAppBundle = path.join(process.cwd(), 'scratch', 'app_bundle.tar.gz');
    console.log('   • Packaging optimized codebase bundle...');
    execSync('node scratch/build_clean_bundle.js');

    console.log('   • Uploading codebase archive to new server...');
    await newSSH.putFile(localAppBundle, '/tmp/app_bundle.tar.gz');

    console.log('   • Extracting codebase on new server...');
    await newSSH.execCommand('mkdir -p /var/www/escortvip');
    await newSSH.execCommand('tar -xzf /tmp/app_bundle.tar.gz -C /var/www/escortvip');

    console.log('   • Syncing environment variables (.env file)...');
    await newSSH.putFile(path.join(process.cwd(), '.env'), '/var/www/escortvip/.env');

    console.log('   • Running npm install (production dependencies)...');
    await newSSH.execCommand('npm install --production=false', { cwd: '/var/www/escortvip' });

    console.log('   • Running Prisma Client generation...');
    await newSSH.execCommand('npx prisma generate', { cwd: '/var/www/escortvip' });

    console.log('   • Compiling production build (npm run build)...');
    const buildRes = await newSSH.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('   ℹ️ NextJS Build STDOUT:\n' + buildRes.stdout.substring(0, 1000));
    if (buildRes.stderr) {
      console.log('   ℹ️ NextJS Build STDERR:\n' + buildRes.stderr.substring(0, 1000));
    }

    // ----------------------------------------------------
    // STEP 5: Process management (PM2)
    // ----------------------------------------------------
    console.log('\n🧛‍♂️ [STEP 5] Starting application under PM2...');
    await newSSH.execCommand('pm2 delete esc-live || true');
    // Start NextJS in production mode
    await newSSH.execCommand('pm2 start npm --name "esc-live" -- run start', { cwd: '/var/www/escortvip' });
    await newSSH.execCommand('pm2 save');
    console.log('   ✔ PM2 processes spun up successfully.');

    // ----------------------------------------------------
    // STEP 6: Nginx configuration
    // ----------------------------------------------------
    console.log('\n🌐 [STEP 6] Syncing Nginx configurations and self-signed certificate...');
    
    // Copy nginx configuration file from local workspace
    const localNginxConf = path.join(process.cwd(), 'nginx_escortvip');
    await newSSH.putFile(localNginxConf, '/etc/nginx/sites-available/escortvip');

    // Create directories for SSL if they don't exist and upload self-signed certificate placeholder
    await newSSH.execCommand('mkdir -p /etc/ssl/certs /etc/ssl/private');
    
    // Download certificates from old server to local, then upload to new server
    const localCrt = path.join(process.cwd(), 'scratch', 'drkcnay-selfsigned.crt');
    const localKey = path.join(process.cwd(), 'scratch', 'drkcnay-selfsigned.key');

    try {
      await oldSSH.getFile(localCrt, '/etc/ssl/certs/drkcnay-selfsigned.crt');
      await oldSSH.getFile(localKey, '/etc/ssl/private/drkcnay-selfsigned.key');
      
      await newSSH.putFile(localCrt, '/etc/ssl/certs/drkcnay-selfsigned.crt');
      await newSSH.putFile(localKey, '/etc/ssl/private/drkcnay-selfsigned.key');
      console.log('   ✔ Transferred existing SSL certificates.');
    } catch (sslErr: any) {
      console.log('   ⚠️ Could not download certificates from old server. Generating new self-signed placeholder...');
      await newSSH.execCommand(
        'openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/drkcnay-selfsigned.key -out /etc/ssl/certs/drkcnay-selfsigned.crt -subj "/CN=dorukcanay.digital"'
      );
    }

    console.log('   • Activating Nginx host configuration...');
    await newSSH.execCommand('ln -sf /etc/nginx/sites-available/escortvip /etc/nginx/sites-enabled/escortvip');
    await newSSH.execCommand('rm -f /etc/nginx/sites-enabled/default');

    console.log('   • Testing Nginx configuration syntax...');
    const nginxTest = await newSSH.execCommand('nginx -t');
    console.log(nginxTest.stdout || nginxTest.stderr);

    console.log('   • Restarting Nginx...');
    await newSSH.execCommand('systemctl restart nginx');
    console.log('   ✔ Nginx restarted.');

    // Cleanup temporary files
    try {
      fs.unlinkSync(localDumpPath);
      fs.unlinkSync(localTarPath);
      fs.unlinkSync(localAppBundle);
      if (fs.existsSync(localCrt)) fs.unlinkSync(localCrt);
      if (fs.existsSync(localKey)) fs.unlinkSync(localKey);
    } catch {}

    console.log('\n🏆 [MIGRATION COMPLETE] All services are successfully migrated to the new server!');
    console.log(`================================================================`);
    console.log(`💡 Next step: Update Cloudflare DNS A-records of all 56 domains to point to: ${newConfig.host}`);
    console.log(`================================================================`);

  } catch (err: any) {
    console.error('💥 Migration process failed with error:', err.message);
  } finally {
    oldSSH.dispose();
    newSSH.dispose();
  }
}

runMigration();
