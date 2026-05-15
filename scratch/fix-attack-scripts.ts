import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function fixAttackScripts() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Syncing Scripts to Attack Server...');

    const scripts = ['elite-gist-autopilot.ts', 'elite-wordpress-autopilot.ts', 'autonomous-seo-siege.ts'];
    
    for (const s of scripts) {
      if (fs.existsSync(`./scripts/${s}`)) {
        console.log(`📄 Writing ${s}...`);
        const content = fs.readFileSync(`./scripts/${s}`, 'utf8');
        await ssh.execCommand(`cat > /root/hydra/scripts/${s} << 'EOF'\n${content}\nEOF`);
      }
    }

    console.log('♻️ Restarting PM2 processes...');
    await ssh.execCommand('pm2 restart all');
    console.log('✅ Attack Server STABILIZED.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

fixAttackScripts();
