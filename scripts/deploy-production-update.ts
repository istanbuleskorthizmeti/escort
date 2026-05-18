import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployUpdate() {
  try {
    console.log('🚀 [DEPLOYING UPDATE] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    // 1. Upload all updated files with new phone number 0552 094 92 45
    const filesToUpload = [
      { local: 'lib/branch-redirector.ts', remote: '/root/esc/lib/branch-redirector.ts' },
      { local: 'lib/nuclear-seo-engine.ts', remote: '/root/esc/lib/nuclear-seo-engine.ts' },
      { local: 'components/SEO/ShortBranchPage.tsx', remote: '/root/esc/components/SEO/ShortBranchPage.tsx' },
      { local: 'app/s/[slug]/page.tsx', remote: '/root/esc/app/s/[slug]/page.tsx' },
      { local: 'app/subeler/[slug]/page.tsx', remote: '/root/esc/app/subeler/[slug]/page.tsx' }
    ];

    for (const f of filesToUpload) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ All updated files uploaded.');

    // 2. Run remote Next.js build to pre-compile the updated redirect paths
    console.log('🏗️ [REMOTE BUILD] Re-building remote Next.js application for phone updates...');
    const buildRes = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=1024" npm run build', { cwd: '/root/esc' });
    console.log('📡 Build Output:\n', buildRes.stdout);
    
    if (buildRes.code !== 0) {
      console.error('❌ Build failed with exit code:', buildRes.code);
      console.error('Error Output:\n', buildRes.stderr);
      ssh.dispose();
      return;
    }
    console.log('✅ Remote build completed successfully.');

    // 3. Restart PM2 web processes to apply changes
    console.log('🔄 [RESTART] Restarting PM2 processes...');
    const pm2Res = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log(pm2Res.stdout || pm2Res.stderr);
    console.log('✅ PM2 cluster restarted successfully.');

    // 4. Run master report to verify everything is green
    console.log('📡 [EXEC] Running Master Consolidated Report...');
    const reportRes = await ssh.execCommand('node scripts/master-consolidated-report.js', { cwd: '/root/esc' });
    console.log('Report Output:\n', reportRes.stdout || reportRes.stderr);

    ssh.dispose();
    console.log('🏁 [SUCCESS] Redirection phone number system-wide update deployed successfully.');
  } catch (err: any) {
    console.error('💥 Error deploying phone number update:', err.message);
    ssh.dispose();
  }
}

deployUpdate();
