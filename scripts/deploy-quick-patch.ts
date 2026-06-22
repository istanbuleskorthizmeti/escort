import { NodeSSH } from 'node-ssh';
import path from 'path';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function quickPatch() {
  try {
    console.log('🔐 [PATCH] Connecting to remote server...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    const filesToUpload = [
      { local: 'lib/google-auth.ts', remote: '/root/esc/lib/google-auth.ts' },
      { local: 'lib/seo/indexing.ts', remote: '/root/esc/lib/seo/indexing.ts' },
      { local: 'app/layout.tsx', remote: '/root/esc/app/layout.tsx' },
      { local: 'scripts/hydra-traffic-blitz.ts', remote: '/root/esc/scripts/hydra-traffic-blitz.ts' },
      { local: '.env', remote: '/root/esc/.env' }
    ];

    for (const file of filesToUpload) {
      console.log(`📤 Uploading ${file.local} -> ${file.remote}...`);
      await ssh.putFile(path.resolve(file.local), file.remote);
    }
    console.log('✅ All modified files uploaded.');

    console.log('⚙️ [BUILD] Triggering Next.js build on VPS...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('Build Output:\n', buildResult.stdout);
    if (buildResult.stderr) {
      console.warn('Build Warning/Error:\n', buildResult.stderr);
    }

    console.log('🧊 [SYNC] Syncing build assets to Nginx static root...');
    await ssh.execCommand('rsync -a --delete /root/esc/.next/ /var/www/escortvip/.next/');

    console.log('🔄 [RELOAD] Restarting PM2 Cluster...');
    const pm2Result = await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(pm2Result.stdout);

    console.log('🌐 [NGINX] Restarting NGINX...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🎉 [SUCCESS] Quick Patch Deployed Successfully!');
  } catch (err: any) {
    console.error('💥 Patch Deployment Failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

quickPatch();
