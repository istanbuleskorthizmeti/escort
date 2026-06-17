import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function patchMobileSpeed() {
  try {
    console.log('🔐 [CONNECTING] Production cluster...');
    await ssh.connect({
      ...config,
      readyTimeout: 60000,
    });

    const files = [
      'components/UI/TrustConsent.tsx',
      'components/SEO/DorukVitrin.tsx',
      'app/page.tsx',
      'app/actions/vitrin.ts',
      'app/layout.tsx',
      'next.config.ts',
      'lib/vitrin-images.ts',
      'app/error.tsx',
      'app/global-error.tsx',
      'public/recovery.js',
      'app/[...slug]/page.tsx',
      'app/amp/route.ts',
      'config/domains.ts',
      'lib/seo/templates.ts',
      'components/SEO/UltraFooter.tsx'
    ];

    for (const f of files) {
      console.log(`🚀 [PATCHING] ${f}...`);
      try {
        await ssh.putFile(path.join(process.cwd(), f), `/root/esc/${f}`);
        console.log(`✅ ${f} synced.`);
      } catch (err) {
        console.warn(`⚠️ Failed to sync ${f}, retrying...`);
        await ssh.putFile(path.join(process.cwd(), f), `/root/esc/${f}`);
      }
    }

    console.log('🏗️ [REBUILDING] Next.js on server...');
    const res = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=4096" npm run build && pm2 restart all', { cwd: '/root/esc' });
    
    console.log(`📡 [STDOUT]:\n${res.stdout}`);
    if (res.stderr) console.warn(`⚠️ [STDERR]:\n${res.stderr}`);

    console.log('🏁 [SYSTEM ONLINE] Server patched and restarted.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [PATCH FAILED]', e);
    ssh.dispose();
  }
}

patchMobileSpeed();
