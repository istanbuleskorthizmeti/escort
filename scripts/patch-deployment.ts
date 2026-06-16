import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

const FILES_TO_PATCH = [
  'middleware.ts',
  'app/profile/[slug]/page.tsx',
  'components/SEO/SEOContentEngine.tsx',
  'app/amp/route.ts',
  'app/[city]/page.tsx',
  'app/[city]/[district]/page.tsx',
  'ecosystem.config.js',
  'cloudflare/honeypot-worker.js',
  'config/domains.ts',
  'lib/site-context.ts',
  'lib/seo-metadata.ts',
  'lib/seo/spintax.ts',
  'lib/seo/templates.ts',
  'app/ansiklopedi/[slug]/page.tsx'
];

async function runPatch() {
  try {
    console.log('🔐 [CONNECTING] Connecting to production server...');
    await ssh.connect(config);

    for (const file of FILES_TO_PATCH) {
      console.log(`📤 [PATCH] Syncing ${file}...`);
      const localPath = path.resolve(process.cwd(), file);
      if (!fs.existsSync(localPath)) {
        throw new Error(`Local file not found: ${file}`);
      }
      
      const content = fs.readFileSync(localPath, 'utf8');
      const base64Content = Buffer.from(content).toString('base64');
      
      // Ensure target directory exists on server
      const targetDir = path.dirname(`/root/esc/${file}`).replace(/\\/g, '/');
      await ssh.execCommand(`mkdir -p ${targetDir}`);
      
      // Upload via base64 stream to prevent any character escaping issues over SSH
      const remotePath = `/root/esc/${file}`.replace(/\\/g, '/');
      await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${remotePath}`);
    }

    console.log('🛑 [PM2 STOP] Stopping PM2 cluster...');
    await ssh.execCommand('pm2 stop all', { cwd: '/root/esc' });

    console.log('⚙️ [BUILD] Triggering Next.js build on production...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log(buildResult.stdout);
    if (buildResult.stderr) console.warn(buildResult.stderr);

    console.log('🚀 [LAUNCH] Reloading PM2 Cluster configuration...');
    const pm2Result = await ssh.execCommand('pm2 delete all && pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(pm2Result.stdout);

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🏁 [SUCCESS] Turkish character patch deployed. All nodes live!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [PATCH DEPLOYMENT FAILED]', err.message);
    ssh.dispose();
  }
}

runPatch();
