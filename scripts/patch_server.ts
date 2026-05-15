import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function patchServer() {
  try {
    console.log('🔐 [CONNECTING] with extended timeout...');
    await ssh.connect({
      ...config,
      readyTimeout: 60000,
    });

    const files = [
      'next.config.ts',
      'google-key.json',
      'lib/site-context.ts',
      'lib/seo/gsc.ts',
      'app/api/seo/route.ts'
    ];

    for (const f of files) {
      console.log(`🚀 [PATCHING] ${f}...`);
      try {
        await ssh.putFile(path.join(process.cwd(), f), `/root/esc/${f}`);
        console.log(`✅ ${f} synced.`);
      } catch (err) {
        console.warn(`⚠️ Failed to sync ${f}, retrying once...`);
        await ssh.putFile(path.join(process.cwd(), f), `/root/esc/${f}`);
      }
    }

    console.log('🏗️ [REBUILDING] Next.js on server...');
    // Use a more stable build command that doesn't overwhelm RAM
    const res = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=4096" npm run build && pm2 restart all', { cwd: '/root/esc' });
    
    console.log(`📡 [STDOUT]: ${res.stdout.substring(0, 1000)}`);
    if (res.stderr) console.warn(`⚠️ [STDERR]: ${res.stderr.substring(0, 1000)}`);

    console.log('🏁 [SYSTEM ONLINE] Server patched and restarted.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [PATCH FAILED]', e);
    ssh.dispose();
  }
}

patchServer();
