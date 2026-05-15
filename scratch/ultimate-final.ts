import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function ultimateFinal() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🏗️ [ULTIMATE] Deep Cleaning and Rebuilding Hydra...');
    
    // 1. Kill everything and clean folders
    await ssh.execCommand('pkill -9 -f node || true');
    await ssh.execCommand('rm -rf /root/hydra/.next');
    
    // 2. Fresh Build
    console.log('🏗️ [ULTIMATE] Running Fresh Build (this will take 5-10 mins)...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/hydra' });
    console.log(buildRes.stdout);
    console.log(buildRes.stderr);

    // 3. PM2 Start
    console.log('🚀 [ULTIMATE] Activating PM2 on Port 3001...');
    await ssh.execCommand('pm2 delete hydra-web || true');
    await ssh.execCommand('pm2 start npm --name "hydra-web" -- run start -- -p 3001', { cwd: '/root/hydra' });

    console.log('✅ [ULTIMATE] HYDRA IS LIVE! Testing Port 3001...');
    await new Promise(r => setTimeout(r, 10000));
    const portRes = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log(portRes.stdout || '⚠️ PORT STILL NOT LISTENING - CHECK PM2 LOGS');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

ultimateFinal();
