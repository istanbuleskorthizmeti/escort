import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    // 1. Inject SAFE layout.tsx
    console.log('🚀 Injecting safe layout.tsx...');
    const layoutContent = fs.readFileSync('c:/Users/onurk/esc/app/layout.tsx', { encoding: 'base64' });
    await ssh.execCommand(`echo "${layoutContent}" | base64 -d > /root/hydra/app/layout.tsx`);
    console.log('✅ Layout injected.');

    // 2. Run clean build
    console.log('\n🏗️  Running FINAL CLEAN BUILD...');
    const buildRes = await ssh.execCommand('cd /root/hydra && rm -rf .next && npm run build');
    
    console.log('--- BUILD OUTPUT ---');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.warn('Build Warnings/Errors:', buildRes.stderr.substring(0, 1000));
    console.log('--------------------');

    if (buildRes.stdout.includes('Successfully compiled')) {
        console.log('\n🚀 RESTARTING HYDRA-WEB...');
        await ssh.execCommand('pm2 restart hydra-web');
        console.log('🏆 SUCCESS! ALL SYSTEMS ONLINE.');
    } else {
        console.error('❌ Build failed. Check the errors above.');
    }

    ssh.dispose();
  } catch (e) {
    console.error('❌ FINAL STRIKE FAILED:', e.message);
  }
}

main();
