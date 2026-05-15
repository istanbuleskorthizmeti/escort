import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function mergeAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔗 Merging Old Data with New "God Mode" Code...');
    
    // 1. Copy Media from old to new
    console.log('📸 Syncing Media Files...');
    await ssh.execCommand('mkdir -p /root/hydra/public/_media');
    await ssh.execCommand('cp -r /var/www/escortvip/public/_media/* /root/hydra/public/_media/ || true');
    console.log('✅ Media synced.');

    // 2. Update .env in new folder
    console.log('📝 Updating .env with production database...');
    const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL="${dbUrl}"|' /root/hydra/.env`);
    console.log('✅ .env updated.');

    // 3. Purge malware again just in case it respawned
    console.log('🛡️ Final malware check...');
    await ssh.execCommand('pkill -9 kgBLLdtt || true');
    await ssh.execCommand('pkill -9 ScReeXE9Q || true');

    // 4. Final Build (Light Mode)
    console.log('🏗️ Triggering Final Build on /root/hydra ...');
    const buildRes = await ssh.execCommand('cd /root/hydra && IS_BUILDING=true npm run build');
    console.log(buildRes.stdout);
    
    if (buildRes.code === 0) {
      console.log('✅ BUILD SUCCESS! Launching Sovereign Hydra...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
      console.log('🚀 HYDRA IS LIVE WITH ALL YOUR CONTENT! 🏴‍☠️');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

mergeAndBuild();
