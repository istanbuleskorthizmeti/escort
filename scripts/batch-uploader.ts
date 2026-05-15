const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function upload() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const files = [
      { local: 'lib/vitrin-images.ts', remote: '/root/esc/lib/vitrin-images.ts' },
      { local: 'config/site.ts', remote: '/root/esc/config/site.ts' },
      { local: 'app/page.tsx', remote: '/root/esc/app/page.tsx' },
      { local: 'app/sitemap.ts', remote: '/root/esc/app/sitemap.ts' },
      { local: 'lib/utils.ts', remote: '/root/esc/lib/utils.ts' },
      { local: 'lib/seo-metadata.ts', remote: '/root/esc/lib/seo-metadata.ts' },
      { local: 'app/profile/[slug]/page.tsx', remote: '/root/esc/app/profile/[slug]/page.tsx' },
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/root/esc/components/SEO/DorukVitrin.tsx' },
      { local: 'components/SEO/IstanbulConquestMatrix.tsx', remote: '/root/esc/components/SEO/IstanbulConquestMatrix.tsx' },
      { local: 'nginx_escortvip', remote: '/etc/nginx/sites-enabled/escortvip' }
    ];

    for (const f of files) {
      console.log(`🚀 [UPLOAD] ${f.local} -> ${f.remote}`);
      const content = fs.readFileSync(path.join(process.cwd(), f.local), 'utf8');
      const base64Content = Buffer.from(content).toString('base64');
      await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${f.remote}`);
    }

    console.log('✅ [DONE] All critical files uploaded successfully.');
    
    console.log("🔄 [REBUILD] Rebuilding Next.js... (This may take a minute)");
    await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    
    console.log("🔄 [RESTART] Restarting PM2 & Nginx...");
    await ssh.execCommand('pm2 restart drkcnay-web-cluster && nginx -s reload', { cwd: '/root/esc' });
    
    ssh.dispose();
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

upload();
