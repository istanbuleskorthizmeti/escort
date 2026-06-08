import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🚀 [DEPLOY] Connecting to root@187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    const filesToUpload = [
      { local: 'config/domains.ts', remote: '/var/www/escortvip/config/domains.ts' },
      { local: 'lib/seo/sitemap-generator.ts', remote: '/var/www/escortvip/lib/seo/sitemap-generator.ts' }
    ];

    for (const f of filesToUpload) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ All updated files uploaded.');

    console.log('🧹 [CLEANUP] Deleting .next cache on server for a clean build...');
    await ssh.execCommand('rm -rf /var/www/escortvip/.next');

    console.log('🏗️ [BUILD] Compiling production client bundle for escortvip...');
    const buildRes = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=2048" npm run build', { cwd: '/var/www/escortvip' });
    console.log('📡 Build Output:\n', buildRes.stdout);

    if (buildRes.code !== 0) {
      console.error('❌ Build failed with code:', buildRes.code);
      console.error('Error Output:\n', buildRes.stderr);
      ssh.dispose();
      return;
    }
    console.log('✅ Production build successful.');

    console.log('🔄 [RESTART] Restarting PM2 processes for escortvip...');
    const pm2Res = await ssh.execCommand('pm2 restart escortvip');
    console.log(pm2Res.stdout || pm2Res.stderr);
    console.log('✅ PM2 cluster restarted successfully.');

    console.log('🧹 [NGINX] Purging Nginx cache and reloading config...');
    const nginxRes = await ssh.execCommand('rm -rf /var/cache/nginx/* && systemctl reload nginx');
    console.log(nginxRes.stdout || nginxRes.stderr || 'Cache purged and Nginx reloaded.');

    ssh.dispose();
    console.log('🏁 [SUCCESS] Deployment completed successfully! Sitemap changes are now live.');
  } catch (err: any) {
    console.error('💥 Error during deployment:', err.message);
    ssh.dispose();
  }
}

run();
