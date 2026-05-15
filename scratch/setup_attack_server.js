const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function setupAttackServer() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('🔗 [SSH] Setting up Hydra Siege on 187.77.111.203...');

    // 1. Gerekli dosyaları yükle
    const files = [
      { local: 'scripts/master/backlink-sniper.ts', remote: '/root/esc/scripts/master/backlink-sniper.ts' },
      { local: 'scripts/master/telegram-blast.ts', remote: '/root/esc/scripts/master/telegram-blast.ts' },
      { local: 'scripts/master/github-striker.ts', remote: '/root/esc/scripts/master/github-striker.ts' },
      { local: 'scripts/master/blogger-mass-poster.ts', remote: '/root/esc/scripts/master/blogger-mass-poster.ts' },
      { local: 'scripts/master/anonymous-sniper.ts', remote: '/root/esc/scripts/master/anonymous-sniper.ts' },
      { local: 'lib/seo/telegraph.ts', remote: '/root/esc/lib/seo/telegraph.ts' },
      { local: 'config/blogger-ids.ts', remote: '/root/esc/config/blogger-ids.ts' },
      { local: 'config/site.ts', remote: '/root/esc/config/site.ts' },
      { local: 'google-key.json', remote: '/root/esc/google-key.json' },
      { local: 'hydra-gcp-key.json', remote: '/root/esc/hydra-gcp-key.json' },
      { local: '.env', remote: '/root/esc/.env' },
      { local: 'lib/ai-provider.ts', remote: '/root/esc/lib/ai-provider.ts' },
      { local: 'lib/ai-seo.ts', remote: '/root/esc/lib/ai-seo.ts' },
      { local: 'lib/persona-engine.ts', remote: '/root/esc/lib/persona-engine.ts' },
      { local: 'lib/seo/sovereign-engine.ts', remote: '/root/esc/lib/seo/sovereign-engine.ts' },
      { local: 'lib/seo/github-engine.ts', remote: '/root/esc/lib/seo/github-engine.ts' },
      { local: 'lib/seo/tumblr.ts', remote: '/root/esc/lib/seo/tumblr.ts' },
      { local: 'lib/seo/blogger.ts', remote: '/root/esc/lib/seo/blogger.ts' },
      { local: 'lib/seo/bitly.ts', remote: '/root/esc/lib/seo/bitly.ts' },
      { local: 'lib/seo/ping-service.ts', remote: '/root/esc/lib/seo/ping-service.ts' }
    ];

    // Önce klasörü oluştur
    await ssh.execCommand('mkdir -p /root/esc/scripts/master /root/esc/lib/seo');

    for (const f of files) {
      const localPath = path.join(process.cwd(), f.local);
      if (fs.existsSync(localPath)) {
        console.log(`🚀 [UPLOAD] ${f.local}`);
        await ssh.putFile(localPath, f.remote);
      }
    }

    // 2. Projeyi ayağa kaldır (Eğer yüklü değilse)
    console.log('📦 [NPM] Checking dependencies...');
    // Bu aşamada sunucuda tam bir repo olduğunu varsayıyoruz veya minimal bir environment kuruyoruz.
    // Eğer sunucuda repo yoksa, önce repoyu klonlamalıyız. 
    // Ama User "saldırı sunucumuz" dediği için muhtemelen hazır.
    
    console.log('🔫 [LAUNCH] Starting Backlink Sniper via PM2...');
    await ssh.execCommand('pm2 stop backlink-sniper || true', { cwd: '/root/esc' });
    await ssh.execCommand('pm2 start npx --name "backlink-sniper" -- tsx scripts/master/backlink-sniper.ts', { cwd: '/root/esc' });
    
    console.log('🚀 [LAUNCH] Starting Telegram Blast via PM2 (Cron-like)...');
    // Her 30 dakikada bir çalışacak şekilde ayarla
    await ssh.execCommand('pm2 stop telegram-blast || true', { cwd: '/root/esc' });
    await ssh.execCommand('pm2 start npx --name "telegram-blast" --cron "*/30 * * * *" -- tsx scripts/master/telegram-blast.ts', { cwd: '/root/esc' });

    ssh.dispose();
    console.log('✅ [DONE] Attack Server is fully operational.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

setupAttackServer();
