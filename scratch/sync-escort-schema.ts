import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function syncEscortSchemaAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Syncing Prisma Schema to Escort Server...');
    
    // 1. Sync schema.prisma
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    await ssh.execCommand(`cat > /root/hydra/prisma/schema.prisma << 'EOF'\n${schema}\nEOF`);
    console.log('✅ Schema synced.');

    // 2. Push DB changes
    console.log('🔄 Pushing DB changes...');
    await ssh.execCommand('cd /root/hydra && npx prisma db push --accept-data-loss');

    // 3. Build again
    console.log('🏗️ Building again...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    // 4. Restart
    if (buildRes.code === 0) {
      console.log('✅ Build success. Restarting...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
      console.log('🚀 Escort server is ONLINE on 3001.');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

syncEscortSchemaAndBuild();
