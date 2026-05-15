const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');
const path = require('path');

async function repair() {
  try {
    console.log('🚀 [GOD MODE] Server Repair Sequence Initialized...');
    
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('📡 Connected to 213.232.235.181');

    // 1. Upload fixed Nginx configs
    console.log('📤 Uploading fixed Nginx configurations...');
    await ssh.putFile('c:/Users/onurk/esc/sovereign-hydra.conf', '/etc/nginx/sites-available/escortvip');
    
    // Ensure symbolic link exists
    await ssh.execCommand('ln -sf /etc/nginx/sites-available/escortvip /etc/nginx/sites-enabled/');

    // 2. Upload fixed Next.js files
    console.log('📤 Uploading fixed Next.js and Lib files...');
    await ssh.putFile('c:/Users/onurk/esc/next.config.ts', '/root/esc/next.config.ts');
    await ssh.putFile('c:/Users/onurk/esc/app/[city]/[district]/page.tsx', '/root/esc/app/[city]/[district]/page.tsx');
    await ssh.putFile('c:/Users/onurk/esc/lib/ai-provider.ts', '/root/esc/lib/ai-provider.ts');
    await ssh.putFile('c:/Users/onurk/esc/lib/ai-seo.ts', '/root/esc/lib/ai-seo.ts');
    await ssh.putFile('c:/Users/onurk/esc/ecosystem.config.js', '/root/esc/ecosystem.config.js');

    // 3. Server-side cleanup and build
    console.log('🧹 Cleaning up and building on server...');
    const commands = [
      'cd /root/esc && npm install --quiet',
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
      if (result.stderr && !result.stderr.includes('warn')) {
        console.warn(`[WARN] ${result.stderr}`);
      }
      console.log(`[STDOUT] ${result.stdout}`);
    }

    console.log('✅ [GOD MODE] Server repaired and services synchronized on Port 3001!');
  } catch (err) {
    console.error('❌ Repair Failed:', err);
  } finally {
    ssh.dispose();
  }
}

repair();
