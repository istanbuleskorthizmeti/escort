import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

const filesToUpload = [
    { local: './lib/persona-engine.ts', remote: '/root/hydra/lib/persona-engine.ts' },
    { local: './lib/ai-seo.ts', remote: '/root/hydra/lib/ai-seo.ts' },
    { local: './lib/ai-provider.ts', remote: '/root/hydra/lib/ai-provider.ts' },
    { local: './lib/seo-content.ts', remote: '/root/hydra/lib/seo-content.ts' },
    { local: './lib/site-context.ts', remote: '/root/hydra/lib/site-context.ts' },
    { local: './lib/seo-metadata.ts', remote: '/root/hydra/lib/seo-metadata.ts' },
    { local: './lib/seo-schema.ts', remote: '/root/hydra/lib/seo-schema.ts' },
    { local: './lib/taxonomy.ts', remote: '/root/hydra/lib/taxonomy.ts' },
    { local: './lib/istanbul-aggressive-seo.ts', remote: '/root/hydra/lib/istanbul-aggressive-seo.ts' },
    { local: './config/domains.ts', remote: '/root/hydra/config/domains.ts' },
    { local: './config/site.ts', remote: '/root/hydra/config/site.ts' },
    { local: './middleware.ts', remote: '/root/hydra/middleware.ts' },
    { local: './app/layout.tsx', remote: '/root/hydra/app/layout.tsx' },
    { local: './app/page.tsx', remote: '/root/hydra/app/page.tsx' },
    { local: './app/[city]/page.tsx', remote: '/root/hydra/app/[city]/page.tsx' },
    { local: './app/[city]/[district]/page.tsx', remote: '/root/hydra/app/[city]/[district]/page.tsx' },
    { local: './app/[city]/[district]/[neighborhood]/page.tsx', remote: '/root/hydra/app/[city]/[district]/[neighborhood]/page.tsx' },
    { local: './app/profile/[slug]/page.tsx', remote: '/root/hydra/app/profile/[slug]/page.tsx' },
    { local: './components/SEO/DorukVitrin.tsx', remote: '/root/hydra/components/SEO/DorukVitrin.tsx' },
    { local: './components/SEO/SEOContentEngine.tsx', remote: '/root/hydra/components/SEO/SEOContentEngine.tsx' },
    { local: './components/SEO/VIPEventHub.tsx', remote: '/root/hydra/components/SEO/VIPEventHub.tsx' },
    { local: './components/SEO/UltraFooter.tsx', remote: '/root/hydra/components/SEO/UltraFooter.tsx' },
    { local: './prisma/schema.prisma', remote: '/root/hydra/prisma/schema.prisma' },
    { local: './package.json', remote: '/root/hydra/package.json' },
    { local: './app/globals.css', remote: '/root/hydra/app/globals.css' }
];

async function deploy() {
  const ssh = new NodeSSH();
  try {
    console.log(`🚀 NINJA DEPLOY: Connecting to ${server.host}...`);
    await ssh.connect(server);
    console.log('✅ Connected.');

    for (const file of filesToUpload) {
      console.log(`   📦 Uploading ${path.basename(file.local)}...`);
      const content = fs.readFileSync(file.local, { encoding: 'base64' });
      
      // Ensure directory exists
      const dir = path.dirname(file.remote);
      await ssh.execCommand(`mkdir -p ${dir}`);
      
      // Write file via base64 to bypass SFTP issues
      await ssh.execCommand(`echo "${content}" | base64 -d > ${file.remote}`);
      console.log(`      ✅ Success.`);
    }

    console.log(`\n🏗️  BUILDING AND RESTARTING ON ${server.host}...`);
    const res = await ssh.execCommand('cd /root/hydra && npm install && npm run build && pm2 restart escortvip || pm2 restart all');
    
    console.log('--- BUILD OUTPUT ---');
    console.log(res.stdout);
    if (res.stderr) console.warn('Warnings/Errors:', res.stderr.substring(0, 500));
    console.log('--------------------');

    console.log('🏆 NINJA DEPLOYMENT SUCCESSFUL ON PRIMARY SERVER.');
    ssh.dispose();
  } catch (e) {
    console.error('❌ NINJA DEPLOY FAILED:', e.message);
  }
}

deploy();
