import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

const files = [
  'app/[city]/page.tsx',
  'app/[city]/[district]/page.tsx',
  'app/[city]/[district]/[neighborhood]/page.tsx',
  'app/[city]/[district]/[neighborhood]/[landmark]/page.tsx'
];

async function syncFixedPages() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Syncing "Unbreakable" Page Routes...');
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      await ssh.execCommand(`cat > /root/hydra/${file} << 'EOF'\n${content}\nEOF`);
      console.log(`✅ Synced: ${file}`);
    }

    console.log('🏗️ Restarting Hydra...');
    await ssh.execCommand('pm2 restart hydra-web');
    console.log('🚀 ESCORT SERVER RECOVERY COMPLETE. 🏁');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

syncFixedPages();
