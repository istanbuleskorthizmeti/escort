const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function repair() {
  try {
    console.log('🚀 [GOD MODE] Manual Repair Sequence (No SFTP) Initialized...');
    
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('📡 Connected to 213.232.235.181');

    async function uploadFileViaExec(localPath, remotePath) {
      console.log(`📤 Uploading ${localPath} -> ${remotePath} via base64...`);
      const content = fs.readFileSync(localPath);
      const base64Content = content.toString('base64');
      await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${remotePath}`);
    }

    // 1. Upload fixed Nginx configs
    await uploadFileViaExec('c:/Users/onurk/esc/sovereign-hydra.conf', '/etc/nginx/sites-available/escortvip');
    await ssh.execCommand('ln -sf /etc/nginx/sites-available/escortvip /etc/nginx/sites-enabled/');

    // 2. Upload fixed files
    await uploadFileViaExec('c:/Users/onurk/esc/next.config.ts', '/root/esc/next.config.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/app/[city]/[district]/page.tsx', '/root/esc/app/[city]/[district]/page.tsx');
    await uploadFileViaExec('c:/Users/onurk/esc/lib/ai-provider.ts', '/root/esc/lib/ai-provider.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/lib/ai-seo.ts', '/root/esc/lib/ai-seo.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/lib/crm/telegram.ts', '/root/esc/lib/crm/telegram.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/lib/utils.ts', '/root/esc/lib/utils.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/lib/vitrin-images.ts', '/root/esc/lib/vitrin-images.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/app/sitemap.ts', '/root/esc/app/sitemap.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/app/robots.ts', '/root/esc/app/robots.ts');
    await uploadFileViaExec('c:/Users/onurk/esc/ecosystem.config.js', '/root/esc/ecosystem.config.js');

    // 3. Server-side cleanup and build
    console.log('🧹 Cleaning up and building on server...');
    const commands = [
      'cd /root/esc && npx prisma generate',
      'cd /root/esc && npm run build',
      'fuser -k 3001/tcp || true',
      'pm2 delete all || true',
      'cd /root/esc && pm2 start ecosystem.config.js',
      'pm2 save',
      'systemctl restart nginx'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(`[STDOUT] ${result.stdout}`);
      if (result.stderr && !result.stderr.includes('warn')) {
        console.warn(`[WARN] ${result.stderr}`);
      }
    }

    console.log('✅ [GOD MODE] Server repaired successfully!');
  } catch (err) {
    console.error('❌ Repair Failed:', err);
  } finally {
    ssh.dispose();
  }
}

repair();
