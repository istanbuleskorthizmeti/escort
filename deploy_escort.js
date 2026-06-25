require('dotenv').config();
const path = require('path');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deploy() {
  try {
    await ssh.connect({
      host: process.env.SSH_HOST || '31.97.79.34',
      username: process.env.SSH_USER || 'root',
      password: process.env.SSH_PASSWORD || 'Oym@icdLt?vY8YQy'
    });
    
    console.log(`Connected to ${process.env.SSH_HOST || '31.97.79.34'}`);

    const files = [
      { local: 'public/vitrin/reklam-ver-banner.png', remote: '/var/www/escortvip/public/vitrin/reklam-ver-banner.png' },
      { local: 'next.config.ts', remote: '/var/www/escortvip/next.config.ts' },
      { local: 'middleware.ts', remote: '/var/www/escortvip/middleware.ts' },
      { local: 'app/layout.tsx', remote: '/var/www/escortvip/app/layout.tsx' },
      { local: 'app/globals.css', remote: '/var/www/escortvip/app/globals.css' },
      { local: 'app/page.tsx', remote: '/var/www/escortvip/app/page.tsx' },
      { local: 'app/[city]/page.tsx', remote: '/var/www/escortvip/app/[city]/page.tsx' },
      { local: 'app/[city]/[district]/page.tsx', remote: '/var/www/escortvip/app/[city]/[district]/page.tsx' },
      { local: 'app/[...slug]/page.tsx', remote: '/var/www/escortvip/app/[...slug]/page.tsx' },
      { local: 'app/amp/route.ts', remote: '/var/www/escortvip/app/amp/route.ts' },
      { local: 'app/api/profiles/vitrin/route.ts', remote: '/var/www/escortvip/app/api/profiles/vitrin/route.ts' },
      { local: 'app/showcase/vitrin/page.tsx', remote: '/var/www/escortvip/app/showcase/vitrin/page.tsx' },
      { local: 'app/widget/vitrin/page.tsx', remote: '/var/www/escortvip/app/widget/vitrin/page.tsx' },
      { local: 'app/embed/vitrin/page.tsx', remote: '/var/www/escortvip/app/embed/vitrin/page.tsx' },
      { local: 'lib/ai-seo.ts', remote: '/var/www/escortvip/lib/ai-seo.ts' },
      { local: 'lib/mathematical-seo.ts', remote: '/var/www/escortvip/lib/mathematical-seo.ts' },
      { local: 'lib/locations-registry/istanbul.ts', remote: '/var/www/escortvip/lib/locations-registry/istanbul.ts' },
      { local: 'lib/seo-content.ts', remote: '/var/www/escortvip/lib/seo-content.ts' },
      { local: 'lib/seo/spintax-engine.ts', remote: '/var/www/escortvip/lib/seo/spintax-engine.ts' },
      { local: 'lib/seo/link-wheel.ts', remote: '/var/www/escortvip/lib/seo/link-wheel.ts' },
      { local: 'lib/seo/schema-generator.ts', remote: '/var/www/escortvip/lib/seo/schema-generator.ts' },
      { local: 'lib/seo/utils.ts', remote: '/var/www/escortvip/lib/seo/utils.ts' },
      { local: 'components/SEO/IstanbulConquestMatrix.tsx', remote: '/var/www/escortvip/components/SEO/IstanbulConquestMatrix.tsx' },
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/var/www/escortvip/components/SEO/DorukVitrin.tsx' },
      { local: 'components/SEO/VitrinWall.tsx', remote: '/var/www/escortvip/components/SEO/VitrinWall.tsx' },
      { local: 'components/SEO/PureAngelVitrin.tsx', remote: '/var/www/escortvip/components/SEO/PureAngelVitrin.tsx' },
      { local: 'components/UI/Navbar.tsx', remote: '/var/www/escortvip/components/UI/Navbar.tsx' },
      { local: 'components/UI/ConciergeSuite.tsx', remote: '/var/www/escortvip/components/UI/ConciergeSuite.tsx' },
      { local: 'components/UI/ShowcaseAdBanner.tsx', remote: '/var/www/escortvip/components/UI/ShowcaseAdBanner.tsx' }
    ];

    console.log('Ensuring remote directories exist...');
    const dirs = [
      '/var/www/escortvip/app/api/profiles/vitrin',
      '/var/www/escortvip/app/showcase/vitrin',
      '/var/www/escortvip/app/widget/vitrin',
      '/var/www/escortvip/app/embed/vitrin',
      '/var/www/escortvip/lib/seo',
      '/var/www/escortvip/components/SEO',
      '/var/www/escortvip/components/UI',
      '/var/www/escortvip/public/vitrin'
    ];
    for (const dir of dirs) {
      await ssh.execCommand(`mkdir -p ${dir}`);
    }

    for (const file of files) {
      const localAbsolutePath = path.join(__dirname, file.local);
      console.log(`Uploading ${localAbsolutePath}...`);
      await ssh.putFile(localAbsolutePath, file.remote);
    }

    console.log('All files uploaded. Triggering build...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('Build STDOUT:\n' + buildResult.stdout);
    console.log('Build STDERR:\n' + buildResult.stderr);

    console.log('Restarting PM2...');
    const pm2Result = await ssh.execCommand('pm2 restart esc-live', { cwd: '/var/www/escortvip' });
    console.log('PM2 STDOUT:\n' + pm2Result.stdout);

    console.log('Deployment complete!');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

deploy();
