import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

const filesToSync = [
  'lib/vitrin-images.ts',
  'app/[city]/page.tsx',
  'app/[city]/[district]/page.tsx',
  'app/[city]/[district]/[neighborhood]/page.tsx',
  'app/[city]/[district]/[neighborhood]/[landmark]/page.tsx'
];

async function finalSyncAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Final Sync: WebP config & Unbreakable routes...');
    
    for (const file of filesToSync) {
      const content = fs.readFileSync(file, 'utf8');
      await ssh.execCommand(`cat > /root/hydra/${file} << 'EOF'\n${content}\nEOF`);
      console.log(`✅ Synced: ${file}`);
    }

    console.log('🏗️ Triggering FINAL God Mode Build...');
    const build = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=4096" && npm run build', { cwd: '/root/hydra' });
    console.log(build.stdout);

    console.log('♻️ Restarting Hydra...');
    await ssh.execCommand('pm2 restart hydra-web');
    
    console.log('🏁 ESCORT SERVER FULLY RECOVERED & OPTIMIZED (WEBP + ARCHIVE + UNBREAKABLE).');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalSyncAndBuild();
