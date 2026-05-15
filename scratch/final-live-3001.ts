import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalLive() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 [ESCORT] Final PM2 Activation on Port 3001...');
    
    await ssh.execCommand('pm2 delete hydra-web || true');
    const startCmd = 'pm2 start npm --name "hydra-web" -- run start -- -p 3001';
    const res = await ssh.execCommand(startCmd, { cwd: '/root/hydra' });
    console.log(res.stdout || res.stderr);

    console.log('⏳ [ESCORT] Waiting for app to warm up...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('📡 [ESCORT] Checking Port 3001 Status...');
    const portRes = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log(portRes.stdout || '⚠️ PORT STILL NOT LISTENING - CHECK LOGS');

    if (portRes.stdout.includes('LISTEN')) {
      console.log('👑 [ESCORT] HYDRA IS LIVE! 502 IS HISTORY!');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalLive();
