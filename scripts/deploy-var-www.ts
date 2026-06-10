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
      { local: 'package.json', remote: '/var/www/escortvip/package.json' },
      { local: 'config/domains.ts', remote: '/var/www/escortvip/config/domains.ts' },
      { local: 'next.config.ts', remote: '/var/www/escortvip/next.config.ts' },
      { local: 'middleware.ts', remote: '/var/www/escortvip/middleware.ts' },
      { local: 'lib/seo/sitemap-generator.ts', remote: '/var/www/escortvip/lib/seo/sitemap-generator.ts' },
      { local: 'lib/seo-schema.ts', remote: '/var/www/escortvip/lib/seo-schema.ts' },
      { local: 'lib/ai-provider.ts', remote: '/var/www/escortvip/lib/ai-provider.ts' },
      { local: 'lib/ai-seo.ts', remote: '/var/www/escortvip/lib/ai-seo.ts' },
      { local: 'lib/site-context.ts', remote: '/var/www/escortvip/lib/site-context.ts' },
      { local: 'lib/utils.ts', remote: '/var/www/escortvip/lib/utils.ts' },
      { local: 'lib/locations.ts', remote: '/var/www/escortvip/lib/locations.ts' },
      { local: 'lib/theme-engine.ts', remote: '/var/www/escortvip/lib/theme-engine.ts' },
      { local: 'lib/gsc-service.ts', remote: '/var/www/escortvip/lib/gsc-service.ts' },
      { local: 'components/SEO/footer-tag-cloud.tsx', remote: '/var/www/escortvip/components/SEO/footer-tag-cloud.tsx' },
      { local: 'components/SEO/SEOContentEngine.tsx', remote: '/var/www/escortvip/components/SEO/SEOContentEngine.tsx' },
      { local: 'components/SEO/UltraFooter.tsx', remote: '/var/www/escortvip/components/SEO/UltraFooter.tsx' },
      { local: 'components/SEO/UserReviews.tsx', remote: '/var/www/escortvip/components/SEO/UserReviews.tsx' },
      { local: 'components/SEO/JsonLd.tsx', remote: '/var/www/escortvip/components/SEO/JsonLd.tsx' },
      { local: 'components/SEO/NicheSnippetSchema.tsx', remote: '/var/www/escortvip/components/SEO/NicheSnippetSchema.tsx' },
      { local: 'app/[...slug]/page.tsx', remote: '/var/www/escortvip/app/[...slug]/page.tsx' },
      { local: 'app/[city]/page.tsx', remote: '/var/www/escortvip/app/[city]/page.tsx' },
      { local: 'app/[city]/[district]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/page.tsx' },
      { local: 'app/[city]/[district]/[neighborhood]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/[neighborhood]/page.tsx' },
      { local: 'app/[city]/[district]/[neighborhood]/[landmark]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/[neighborhood]/[landmark]/page.tsx' },
      { local: 'app/[city]/[district]/[neighborhood]/kategori/[slug]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/[neighborhood]/kategori/[slug]/page.tsx' },
      { local: 'app/[city]/[district]/kategori/[slug]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/kategori/[slug]/page.tsx' },
      { local: 'app/[city]/kategori/[slug]/page.tsx', remote: '/var/www/escortvip/app/[city]/kategori/[slug]/page.tsx' },
      { local: 'components/SEO/MathematicalSEO.tsx', remote: '/var/www/escortvip/components/SEO/MathematicalSEO.tsx' },
      { local: 'components/SEO/VIPEventHub.tsx', remote: '/var/www/escortvip/components/SEO/VIPEventHub.tsx' },
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/var/www/escortvip/components/SEO/DorukVitrin.tsx' },
      { local: 'components/UI/LivePhotoMarquee.tsx', remote: '/var/www/escortvip/components/UI/LivePhotoMarquee.tsx' },
      { local: 'app/layout.tsx', remote: '/var/www/escortvip/app/layout.tsx' },
      { local: 'app/page.tsx', remote: '/var/www/escortvip/app/page.tsx' },
      { local: 'app/amp/route.ts', remote: '/var/www/escortvip/app/amp/route.ts' },
      { local: 'app/go/[id]/route.ts', remote: '/var/www/escortvip/app/go/[id]/route.ts' },
      { local: 'app/api/media/vitrin/[filename]/route.ts', remote: '/var/www/escortvip/app/api/media/vitrin/[filename]/route.ts' },
      { local: 'lib/seo-metadata.ts', remote: '/var/www/escortvip/lib/seo-metadata.ts' },
      { local: 'lib/spintax-engine.ts', remote: '/var/www/escortvip/lib/spintax-engine.ts' },
      { local: 'components/UI/MobileAppBanner.tsx', remote: '/var/www/escortvip/components/UI/MobileAppBanner.tsx' },
      { local: 'public/.well-known/assetlinks.json', remote: '/var/www/escortvip/public/.well-known/assetlinks.json' },
      { local: 'public/.well-known/apple-app-site-association', remote: '/var/www/escortvip/public/.well-known/apple-app-site-association' },
      { local: 'public/apple-app-site-association', remote: '/var/www/escortvip/public/apple-app-site-association' },
      { local: 'public/manifest.json', remote: '/var/www/escortvip/public/manifest.json' },
      { local: 'public/drkcnay-elite-key.txt', remote: '/var/www/escortvip/public/drkcnay-elite-key.txt' },
      { local: 'public/8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f.txt', remote: '/var/www/escortvip/public/8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f.txt' },
      { local: 'lib/google-indexing.ts', remote: '/var/www/escortvip/lib/google-indexing.ts' },
      { local: 'lib/vitrin-images.ts', remote: '/var/www/escortvip/lib/vitrin-images.ts' },
      { local: 'data/live_google_sites.json', remote: '/var/www/escortvip/data/live_google_sites.json' },
      { local: 'data/amp_unique_content.json', remote: '/var/www/escortvip/data/amp_unique_content.json' },
      { local: 'scripts/hydra-conqueror.ts', remote: '/var/www/escortvip/scripts/hydra-conqueror.ts' },
      { local: 'scripts/rss-ping-generator.ts', remote: '/var/www/escortvip/scripts/rss-ping-generator.ts' },
      { local: 'scripts/fleet-gsc-automation.ts', remote: '/var/www/escortvip/scripts/fleet-gsc-automation.ts' }
    ];

    for (const f of filesToUpload) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ All updated files uploaded.');

    console.log('📝 Updating LLM_MODEL in remote .env to gemini-flash-latest...');
    await ssh.execCommand('sed -i \'s/LLM_MODEL=.*/LLM_MODEL="gemini-flash-latest"/g\' /var/www/escortvip/.env');
    console.log('📝 Updating PAGESPEED_API_KEY in remote .env...');
    await ssh.execCommand('grep -q "^PAGESPEED_API_KEY=" /var/www/escortvip/.env && sed -i \'s/PAGESPEED_API_KEY=.*/PAGESPEED_API_KEY="AIzaSyDuPRdF2fh6ja35xqxZmBmEp3gFQ0poRIM"/g\' /var/www/escortvip/.env || echo \'PAGESPEED_API_KEY="AIzaSyDuPRdF2fh6ja35xqxZmBmEp3gFQ0poRIM"\' >> /var/www/escortvip/.env');
    console.log('✅ Remote .env updated.');

    console.log('📦 [INSTALL] Installing remote node_modules dependencies (including sharp)...');
    const installRes = await ssh.execCommand('npm install', { cwd: '/var/www/escortvip' });
    console.log(installRes.stdout || installRes.stderr);

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
  } catch (err: unknown) {
    console.error('💥 Error during deployment:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
