const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function uploadFix() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const files = [
      { local: 'lib/vitrin-images.ts', remote: '/root/esc/lib/vitrin-images.ts' },
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/root/esc/components/SEO/DorukVitrin.tsx' }
    ];

    for (const f of files) {
      console.log(`🚀 [UPLOAD] ${f.local} -> ${f.remote}`);
      const content = fs.readFileSync(path.join(process.cwd(), f.local), 'utf8');
      const base64Content = Buffer.from(content).toString('base64');
      await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${f.remote}`);
    }

    console.log("🔄 [REBUILD] Rebuilding Next.js...");
    await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    
    console.log("🔄 [RESTART] Restarting PM2...");
    await ssh.execCommand('pm2 restart drkcnay-web-cluster', { cwd: '/root/esc' });
    
    ssh.dispose();
    console.log('✅ [DONE] Deduplication fix deployed.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

uploadFix();
