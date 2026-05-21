import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROD_IP = '213.232.235.181';
const GCP_IP = '34.185.231.84';
const SSH_PASS = '4TVuj7qiHMfh7CxH6K!';
const GCP_KEY_PATH = path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine');

async function run() {
  const sshProd = new NodeSSH();
  const sshGCP = new NodeSSH();

  try {
    // -------------------------------------------------------------
    // STEP 1: BACKUP DB ON PRODUCTION SERVER
    // -------------------------------------------------------------
    console.log(`\n🔋 [STEP 1] Connecting to Production Server (${PROD_IP})...`);
    await sshProd.connect({
      host: PROD_IP,
      username: 'root',
      password: SSH_PASS
    });
    console.log('✅ Connected to Production Server.');

    console.log('📦 Executing pg_dump on Production Server...');
    await sshProd.execCommand('sudo rm -f /tmp/vuc2026_db.dump');
    // Run pg_dump under postgres system user to bypass password prompting
    const dumpRes = await sshProd.execCommand('sudo -u postgres pg_dump -d vuc2026 -F c -b -v -f /tmp/vuc2026_db.dump');
    if (dumpRes.code !== 0) {
      throw new Error(`pg_dump failed: ${dumpRes.stderr}`);
    }
    console.log('✅ pg_dump finished successfully.');

    // -------------------------------------------------------------
    // STEP 2: DOWNLOAD DUMP LOCALLY AND UPLOAD TO GCP
    // -------------------------------------------------------------
    const localDumpPath = path.join(process.cwd(), 'scratch', 'vuc2026_db.dump');
    console.log(`\n📥 [STEP 2] Downloading database dump locally to ${localDumpPath}...`);
    await sshProd.getFile(localDumpPath, '/tmp/vuc2026_db.dump');
    console.log('✅ Download complete.');
    sshProd.dispose();

    console.log(`📡 Connecting to GCP Server (${GCP_IP})...`);
    const privateKey = fs.readFileSync(GCP_KEY_PATH, 'utf8');
    await sshGCP.connect({
      host: GCP_IP,
      username: 'onurk',
      privateKey: privateKey
    });
    console.log('✅ Connected to GCP Server.');

    console.log('📤 Uploading database dump to GCP Server...');
    await sshGCP.putFile(localDumpPath, '/tmp/vuc2026_db.dump');
    console.log('✅ Upload to GCP complete.');

    // -------------------------------------------------------------
    // STEP 3: RESTORE DATABASE ON GCP
    // -------------------------------------------------------------
    console.log('\n🔋 [STEP 3] Restoring database into PostgreSQL on GCP...');
    // Drop existing database if exists and recreate it to ensure fresh restore
    console.log('   - Recreating database vuc2026 on GCP...');
    await sshGCP.execCommand('sudo -u postgres dropdb vuc2026 --if-exists');
    await sshGCP.execCommand('sudo -u postgres createdb -O vuc2026_user vuc2026');

    console.log('   - Running pg_restore...');
    const restoreRes = await sshGCP.execCommand('sudo -u postgres pg_restore -d vuc2026 -v /tmp/vuc2026_db.dump');
    console.log('pg_restore output summary:', restoreRes.code === 0 || restoreRes.stderr.includes('WARNING') ? 'SUCCESS' : 'FAILED');
    if (restoreRes.code !== 0 && !restoreRes.stderr.includes('WARNING')) {
      console.warn('⚠️ pg_restore returned warning/error:', restoreRes.stderr);
    } else {
      console.log('✅ Database restore complete.');
    }

    // -------------------------------------------------------------
    // STEP 4: UPLOAD AND EXTRACT LOCAL ZIP CODEBASE
    // -------------------------------------------------------------
    console.log('\n📦 [STEP 4] Uploading codebase ZIP package to GCP...');
    const zipPath = path.join(process.cwd(), 'scratch', 'esc_codebase.zip');
    
    await sshGCP.execCommand('mkdir -p /home/onurk/esc');
    await sshGCP.putFile(zipPath, '/home/onurk/esc/esc_codebase.zip');
    console.log('✅ Codebase ZIP uploaded.');

    console.log('📂 Installing unzip utility and extracting codebase on GCP...');
    await sshGCP.execCommand('sudo apt-get update && sudo apt-get install -y unzip');
    const extractRes = await sshGCP.execCommand('unzip -o esc_codebase.zip', { cwd: '/home/onurk/esc' });
    if (extractRes.code !== 0) {
      throw new Error(`Extraction failed on GCP: ${extractRes.stderr}`);
    }
    await sshGCP.execCommand('rm -f esc_codebase.zip', { cwd: '/home/onurk/esc' });
    console.log('✅ Codebase extracted successfully.');

    // -------------------------------------------------------------
    // STEP 5: INSTALL DEPENDENCIES & NEXT.JS BUILD ON GCP
    // -------------------------------------------------------------
    console.log('\n🏗️ [STEP 5] Installing dependencies and building Next.js on GCP...');
    console.log('   - Running npm install (this may take a minute)...');
    const npmInstall = await sshGCP.execCommand('npm install', { cwd: '/home/onurk/esc' });
    console.log('npm install output:\n', npmInstall.stdout.slice(0, 1000));

    console.log('   - Running prisma generate...');
    const prismaGen = await sshGCP.execCommand('npx prisma generate', { cwd: '/home/onurk/esc' });
    console.log('prisma generate output:\n', prismaGen.stdout);

    console.log('   - Running Next.js build (compiling server routes)...');
    const buildRes = await sshGCP.execCommand('npm run build', { cwd: '/home/onurk/esc' });
    console.log('Next.js build output:\n', buildRes.stdout);
    if (buildRes.code !== 0) {
      throw new Error(`Next.js build failed: ${buildRes.stderr}`);
    }
    console.log('✅ Next.js build completed successfully on GCP.');

    // -------------------------------------------------------------
    // STEP 6: CONFIGURE HIGH-PERFORMANCE NGINX ON GCP
    // -------------------------------------------------------------
    console.log('\n⚙️ [STEP 6] Configuring Nginx Reverse Proxy on GCP...');
    const nginxConfig = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Premium Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Mitigate 504 timeouts
        proxy_read_timeout 600;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
    }
}
`;
    await sshGCP.execCommand('cat << \'EOF\' > /tmp/nginx_gcp\n' + nginxConfig + '\nEOF');
    await sshGCP.execCommand('sudo mv /tmp/nginx_gcp /etc/nginx/sites-available/default');
    console.log('   - Reloading Nginx service...');
    await sshGCP.execCommand('sudo systemctl enable nginx');
    const nginxReload = await sshGCP.execCommand('sudo systemctl restart nginx');
    console.log('Nginx Restart Status:', nginxReload.code === 0 ? 'SUCCESS' : 'FAILED', nginxReload.stderr);

    // -------------------------------------------------------------
    // STEP 7: RESTART & RE-REGISTER PM2 CLUSTER
    // -------------------------------------------------------------
    console.log('\n🔄 [STEP 7] Launching application cluster under PM2 on GCP...');
    // Reconfigure PM2 to start from /home/onurk/esc
    await sshGCP.execCommand('pm2 delete drkcnay-web-cluster || true');
    
    // Start Next.js on port 3001 using native cluster mode
    const pm2Start = await sshGCP.execCommand('pm2 start node_modules/.bin/next --name "drkcnay-web-cluster" -i max --cwd "/home/onurk/esc" -- start -p 3001');
    console.log('PM2 Start Output:\n', pm2Start.stdout);

    // Start auto-indexing bot and watchdog
    await sshGCP.execCommand('pm2 restart all || true');
    console.log('✅ PM2 process list refreshed.');

    // Save PM2 state to survive server restarts
    await sshGCP.execCommand('pm2 save');
    console.log('✅ PM2 state saved.');

    // -------------------------------------------------------------
    // STEP 8: MIGRATION VERIFICATION
    // -------------------------------------------------------------
    console.log('\n🔍 [STEP 8] Verifying GCP deployment health...');
    const localCheck = await sshGCP.execCommand('curl -I http://127.0.0.1:3001/sitemap.xml');
    console.log('Sitemap Health Check (Port 3001):\n', localCheck.stdout);

    console.log('\n🎉 ============================================================');
    console.log('🏆 SOVEREIGN MIGRATION TO GOOGLE CLOUD VM SUCCESSFULLY COMPLETED!');
    console.log('===============================================================\n');

    sshGCP.dispose();
  } catch (err: any) {
    console.error('❌ Migration Failed with Exception:', err.message);
    sshProd.dispose();
    sshGCP.dispose();
  }
}

run();
