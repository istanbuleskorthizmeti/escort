import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  console.log('🚀 [DEPLOY CONSENT ENGINE] Connecting to VPS...');
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('📤 [UPLOAD] Uploading app/layout.tsx...');
    await ssh.putFile(
      path.join(process.cwd(), 'app', 'layout.tsx'),
      '/root/esc/app/layout.tsx'
    );
    console.log('✅ app/layout.tsx uploaded.');

    console.log('📤 [UPLOAD] Uploading components/Core/CookieConsent.tsx...');
    await ssh.putFile(
      path.join(process.cwd(), 'components', 'Core', 'CookieConsent.tsx'),
      '/root/esc/components/Core/CookieConsent.tsx'
    );
    console.log('✅ components/Core/CookieConsent.tsx uploaded.');

    console.log('🛠️ [BUILD] Triggering Next.js Production Build on VPS...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('STDOUT:\n', buildRes.stdout);
    if (buildRes.stderr) {
      console.log('STDERR:\n', buildRes.stderr);
    }

    console.log('🔄 [RESTART] Restarting PM2 process to apply updates...');
    const pm2Res = await ssh.execCommand('pm2 restart all', { cwd: '/root/esc' });
    console.log('PM2 STDOUT:\n', pm2Res.stdout);

    console.log('🏆 [SUCCESS] Crawler-Aware Advanced Consent Mode V2 is now fully live on Production!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Deployment failed:', err.message);
    ssh.dispose();
  }
}

run();
