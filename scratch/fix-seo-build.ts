import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function fixSeoContentAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Fixing SEO Content logic on Escort Server...');
    
    const content = fs.readFileSync('./lib/seo-content.ts', 'utf8');
    await ssh.execCommand(`cat > /root/hydra/lib/seo-content.ts << 'EOF'\n${content}\nEOF`);
    console.log('✅ seo-content.ts fixed.');

    console.log('🏗️ Triggering Light Build (Skipping AI)...');
    // We kill old build first
    await ssh.execCommand('pkill -9 next || true');
    
    const buildRes = await ssh.execCommand('cd /root/hydra && IS_BUILDING=true npm run build');
    console.log(buildRes.stdout);
    
    if (buildRes.code === 0) {
      console.log('✅ BUILD SUCCESS! Restarting...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
      console.log('🚀 ESCORT SERVER IS ONLINE (LIGHT MODE).');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

fixSeoContentAndBuild();
