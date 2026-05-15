import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalBuildAttempt() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Final Build Attempt on Escort Server...');
    
    // 1. Resolve conflicts
    await ssh.execCommand('rm -rf /root/hydra/app/sitemap.xml/route.ts || true');
    await ssh.execCommand('rm -rf /root/hydra/app/amp/route.ts || true');
    console.log('✅ Conflicts cleared.');

    // 2. Build
    console.log('🏗️ Building...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    // 3. Restart if success
    if (buildRes.code === 0) {
      console.log('✅ BUILD SUCCESS! Starting app...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
      console.log('🚀 ESCORT SERVER IS ONLINE!');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalBuildAttempt();
