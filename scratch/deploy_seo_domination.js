const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function deploySeoFix() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const files = [
      { local: 'nginx_escortvip', remote: '/etc/nginx/sites-enabled/escortvip' },
      { local: 'components/SEO/DorukVitrin.tsx', remote: '/root/esc/components/SEO/DorukVitrin.tsx' },
      { local: 'components/SEO/VitrinWall.tsx', remote: '/root/esc/components/SEO/VitrinWall.tsx' }
    ];

    for (const f of files) {
      console.log(`🚀 [UPLOAD] ${f.local} -> ${f.remote}`);
      const content = fs.readFileSync(path.join(process.cwd(), f.local), 'utf8');
      const base64Content = Buffer.from(content).toString('base64');
      await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${f.remote}`);
    }

    console.log('🧪 [TEST] Testing Nginx...');
    const nginxTest = await ssh.execCommand('nginx -t');
    if (nginxTest.code === 0) {
      console.log('🔄 [RELOAD] Reloading Nginx...');
      await ssh.execCommand('nginx -s reload');
    }

    console.log("🔄 [REBUILD] Rebuilding Next.js...");
    await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    
    console.log("🔄 [RESTART] Restarting PM2...");
    await ssh.execCommand('pm2 restart drkcnay-web-cluster', { cwd: '/root/esc' });
    
    ssh.dispose();
    console.log('✅ [DONE] Image SEO Domination deployed.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

deploySeoFix();
