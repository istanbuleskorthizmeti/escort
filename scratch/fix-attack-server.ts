import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function fixAttackServer() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Fixing Attack Server (187.77.111.203)...');
    
    // 1. Sync schema.prisma
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    await ssh.execCommand(`cat > /root/hydra/prisma/schema.prisma << 'EOF'\n${schema}\nEOF`);
    console.log('✅ Schema synced.');

    // 2. Push DB changes
    console.log('🔄 Pushing DB changes...');
    await ssh.execCommand('cd /root/hydra && npx prisma db push --accept-data-loss');

    // 3. Sync scripts
    console.log('📤 Syncing scripts...');
    const scriptFiles = fs.readdirSync('./scripts');
    for (const f of scriptFiles) {
      if (f.endsWith('.ts')) {
        const content = fs.readFileSync(`./scripts/${f}`, 'utf8');
        await ssh.execCommand(`cat > /root/hydra/scripts/${f} << 'EOF'\n${content}\nEOF`);
      }
    }
    console.log('✅ Scripts synced.');

    // 4. Restart autopilots
    console.log('♻️ Restarting processes...');
    await ssh.execCommand('pm2 restart all');
    console.log('🚀 Attack server is STABILIZED.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

fixAttackServer();
