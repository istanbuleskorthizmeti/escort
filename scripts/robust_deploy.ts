import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    console.log('🚀 [CONNECTING] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Delete old app/robots.ts and deprecated route folders to avoid build conflicts
    console.log('🗑️ [CLEANUP] Deleting remote app/robots.ts and duplicate route folders if exist...');
    await ssh.execCommand('rm -f /root/esc/app/robots.ts');
    await ssh.execCommand('rm -rf /root/esc/app/robots.txt /root/esc/app/sitemap.xml /root/esc/app/sitemap-[id].xml /root/esc/app/api/seo/robots /root/esc/app/api/seo/sitemap /root/esc/app/api/seo/sitemap-[id]');

    // 2. Upload all fixed files
    const filesToUpload = [
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/root/esc/components/SEO/DorukVitrin.tsx' },
      { local: 'lib/vitrin-images.ts', remote: '/root/esc/lib/vitrin-images.ts' },
      { local: 'app/blog/page.tsx', remote: '/root/esc/app/blog/page.tsx' },
      { local: 'app/experts/page.tsx', remote: '/root/esc/app/experts/page.tsx' },
      { local: 'app/privacy/page.tsx', remote: '/root/esc/app/privacy/page.tsx' },
      { local: 'app/terms/page.tsx', remote: '/root/esc/app/terms/page.tsx' },
      { local: 'app/api/seo/route.ts', remote: '/root/esc/app/api/seo/route.ts' },
      { local: 'app/api/admin/seo/hard-push/route.ts', remote: '/root/esc/app/api/admin/seo/hard-push/route.ts' },
      { local: 'next.config.ts', remote: '/root/esc/next.config.ts' },
      { local: 'lib/seo/sitemap-generator.ts', remote: '/root/esc/lib/seo/sitemap-generator.ts' },
      { local: 'app/robots.txt/route.ts', remote: '/root/esc/app/robots.txt/route.ts' },
      { local: 'app/sitemap.xml/route.ts', remote: '/root/esc/app/sitemap.xml/route.ts' },
      { local: 'app/sitemap-[id].xml/route.ts', remote: '/root/esc/app/sitemap-[id].xml/route.ts' },
      { local: 'app/layout.tsx', remote: '/root/esc/app/layout.tsx' }
    ];

    for (const f of filesToUpload) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      // Ensure the remote directory exists
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ All files uploaded successfully.');

    // 3. Clean Next.js cache and run remote Next.js build with low-memory option
    console.log('🏗️ [REMOTE BUILD] Deleting .next directory for clean compilation...');
    await ssh.execCommand('rm -rf /root/esc/.next');
    
    console.log('🏗️ [REMOTE BUILD] Running remote npm run build with memory-optimized node flags...');
    const buildRes = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=1024" npm run build', { cwd: '/root/esc' });
    console.log('📡 Build Output:\n', buildRes.stdout);
    
    if (buildRes.code !== 0) {
      console.error('❌ Build failed with exit code:', buildRes.code);
      console.error('Error Output:\n', buildRes.stderr);
      ssh.dispose();
      return;
    }
    console.log('✅ Remote build completed successfully.');

    // 3. Restart PM2 cluster processes
    console.log('🔄 [RESTART] Restarting PM2 processes...');
    const pm2Res = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log(pm2Res.stdout || pm2Res.stderr);
    console.log('✅ PM2 cluster restarted successfully.');

    // 4. Purge Nginx cache to ensure clean updates
    console.log('🧹 [PURGE] Purging Nginx cache...');
    const nginxRes = await ssh.execCommand('rm -rf /var/cache/nginx/* && systemctl reload nginx');
    console.log(nginxRes.stdout || nginxRes.stderr || 'Cache purged and Nginx reloaded.');

    console.log('🏁 [SUCCESS] Deployment complete and live!');
    ssh.dispose();
  } catch (err) {
    console.error('💥 Error:', err);
    ssh.dispose();
  }
}

run();
