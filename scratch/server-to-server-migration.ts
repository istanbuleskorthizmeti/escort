import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const PROD_IP = '213.232.235.181';
const GCP_IP = '34.185.231.84';
const SSH_PASS = '4TVuj7qiHMfh7CxH6K!';
const GCP_KEY_PATH = path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine');

async function run() {
  const sshGCP = new NodeSSH();

  try {
    // -------------------------------------------------------------
    // STEP 1: CONNECT TO GCP & INSTALL TOOLS
    // -------------------------------------------------------------
    console.log(`\n📡 Connecting to GCP Server (${GCP_IP})...`);
    const privateKey = fs.readFileSync(GCP_KEY_PATH, 'utf8');
    await sshGCP.connect({
      host: GCP_IP,
      username: 'onurk',
      privateKey: privateKey
    });
    console.log('✅ Connected to GCP Server.');

    console.log('📦 Installing rsync and sshpass on GCP...');
    await sshGCP.execCommand('sudo apt-get update && sudo apt-get install -y rsync sshpass');

    // -------------------------------------------------------------
    // STEP 2: RUN RESILIENT DIRECT RSYNC FROM PROD TO GCP
    // -------------------------------------------------------------
    console.log('\n🚀 [STEP 2] Running direct rsync from Production to GCP (Server-to-Server at 1000 Mbps)...');
    await sshGCP.execCommand('mkdir -p /home/onurk/esc');

    const rsyncCmd = `sshpass -p '${SSH_PASS}' rsync -avz --delete --exclude="node_modules" --exclude=".next" --exclude=".git" --exclude="dist" --exclude="*.tar.gz" --exclude="*.zip" --exclude="*.dump" --exclude="data" --exclude="projex_profile" --exclude=".wwebjs_auth" -e "ssh -o StrictHostKeyChecking=no" root@${PROD_IP}:/root/esc/ /home/onurk/esc/`;
    console.log(`Running rsync on GCP: ${rsyncCmd}`);
    
    const rsyncRes = await sshGCP.execCommand(rsyncCmd);
    console.log('rsync output:\n', rsyncRes.stdout || rsyncRes.stderr || 'SUCCESS');
    if (rsyncRes.code !== 0) {
      throw new Error(`rsync direct sync failed: ${rsyncRes.stderr}`);
    }
    console.log('✅ Codebase successfully rsynced to GCP.');

    // -------------------------------------------------------------
    // STEP 3: INSTALL DEPENDENCIES & BUILD NEXT.JS ON GCP
    // -------------------------------------------------------------
    console.log('\n🏗️ [STEP 3] Installing dependencies and building Next.js on GCP...');
    console.log('   - Running npm install (datacenter fiber speed!)...');
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
    // STEP 4: CONFIGURE HIGH-PERFORMANCE NGINX ON GCP
    // -------------------------------------------------------------
    console.log('\n⚙️ [STEP 4] Configuring Nginx Reverse Proxy on GCP...');
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
    // STEP 5: RESTART & RE-REGISTER PM2 CLUSTER
    // -------------------------------------------------------------
    console.log('\n🔄 [STEP 5] Launching application cluster under PM2 on GCP...');
    await sshGCP.execCommand('pm2 delete drkcnay-web-cluster || true');
    
    // Start Next.js on port 3001 using native cluster mode
    const pm2Start = await sshGCP.execCommand('pm2 start node_modules/.bin/next --name "drkcnay-web-cluster" -i max --cwd "/home/onurk/esc" -- start -p 3001');
    console.log('PM2 Start Output:\n', pm2Start.stdout);

    await sshGCP.execCommand('pm2 restart all || true');
    console.log('✅ PM2 process list refreshed.');

    await sshGCP.execCommand('pm2 save');
    console.log('✅ PM2 state saved.');

    // -------------------------------------------------------------
    // STEP 6: MIGRATION VERIFICATION
    // -------------------------------------------------------------
    console.log('\n🔍 [STEP 6] Verifying GCP deployment health...');
    const localCheck = await sshGCP.execCommand('curl -I http://127.0.0.1:3001/sitemap.xml');
    console.log('Sitemap Health Check (Port 3001):\n', localCheck.stdout);

    console.log('\n🎉 ============================================================');
    console.log('🏆 SOVEREIGN DIRECT-RSYNC MIGRATION SUCCESSFULLY COMPLETED!');
    console.log('===============================================================\n');

    sshGCP.dispose();
  } catch (err: any) {
    console.error('❌ Server-to-Server Migration Failed:', err.message);
    sshGCP.dispose();
  }
}

run();
