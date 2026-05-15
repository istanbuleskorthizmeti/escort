import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🏗️ Triggering Final "Unbreakable" Build on Escort Server...');
    
    // Run build with resource-safe flags
    const build = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=4096" && npm run build', { cwd: '/root/hydra' });
    console.log('--- BUILD OUTPUT ---');
    console.log(build.stdout);
    console.log(build.stderr);

    console.log('♻️ Restarting PM2...');
    await ssh.execCommand('pm2 restart hydra-web');
    
    console.log('🏁 ALL SYSTEMS GO. SITE SHOULD BE LIVE AND STABLE.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalBuild();
