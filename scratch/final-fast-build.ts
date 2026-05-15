import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalFastBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Triggering FAST Build on Escort Server...');
    
    const config = fs.readFileSync('./next.config.ts', 'utf8');
    await ssh.execCommand(`cat > /root/hydra/next.config.ts << 'EOF'\n${config}\nEOF`);
    console.log('✅ next.config.ts optimized.');

    // Kill old stuff
    await ssh.execCommand('pkill -9 next || true');
    await ssh.execCommand('pkill -9 node || true');

    console.log('🏗️ Building (No Static Generation Timeout, No Lint, No TS)...');
    const buildRes = await ssh.execCommand('cd /root/hydra && IS_BUILDING=true npm run build');
    console.log(buildRes.stdout);
    
    if (buildRes.code === 0) {
      console.log('✅ BUILD SUCCESS! Restarting...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
      console.log('🚀 HYDRA IS LIVE! 🏁');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalFastBuild();
