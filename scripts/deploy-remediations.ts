import { NodeSSH } from 'node-ssh';
import path from 'path';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    console.log('🚀 [DEPLOY RE-MED] Connecting to root@187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    const filesToUpload = [
      { local: 'app/layout.tsx', remote: '/root/esc/app/layout.tsx' },
      { local: 'components/UI/MobileAppBanner.tsx', remote: '/root/esc/components/UI/MobileAppBanner.tsx' },
      { local: 'scripts/generate-readme-project.ts', remote: '/root/esc/scripts/generate-readme-project.ts' }
    ];

    for (const f of filesToUpload) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ Updated files uploaded successfully.');

    console.log('🏗️ [BUILD] Re-building Next.js application on VPS...');
    const buildRes = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=2048" npm run build', { cwd: '/root/esc' });
    console.log('📡 Build Output:\n', buildRes.stdout);
    if (buildRes.stderr) {
      console.log('📡 Build Errors/Warnings:\n', buildRes.stderr);
    }

    if (buildRes.code !== 0) {
      console.error('❌ Build failed on VPS. Exit code:', buildRes.code);
      ssh.dispose();
      return;
    }
    console.log('✅ Next.js build completed successfully on VPS.');

    console.log('🔄 [RESTART] Restarting PM2 drkcnay-web-cluster...');
    const pm2Res = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log(pm2Res.stdout || pm2Res.stderr);
    console.log('✅ PM2 web cluster restarted.');

    console.log('🧹 [NGINX] Reloading Nginx server...');
    const nginxRes = await ssh.execCommand('systemctl reload nginx');
    console.log(nginxRes.stdout || nginxRes.stderr || 'Nginx reloaded.');

    console.log('🏁 [SUCCESS] All reputation and technical fixes successfully deployed.');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Deployment failed:', err.message);
    ssh.dispose();
  }
}

run();
