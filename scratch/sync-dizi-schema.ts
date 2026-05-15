import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function syncSchemaAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Syncing Prisma Schema to Dizi Server...');
    
    // 1. Sync schema.prisma
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    await ssh.execCommand(`cat > /var/www/escortvip/prisma/schema.prisma << 'EOF'\n${schema}\nEOF`);
    console.log('✅ Schema synced.');

    // 2. Push DB changes
    console.log('🔄 Pushing DB changes...');
    await ssh.execCommand('cd /var/www/escortvip && npx prisma db push --accept-data-loss');

    // 3. Build again
    console.log('🏗️ Building again...');
    const buildRes = await ssh.execCommand('cd /var/www/escortvip && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    // 4. Restart
    if (buildRes.code === 0) {
      console.log('✅ Build success. Restarting...');
      await ssh.execCommand('pm2 delete dizicehennemi-web || true');
      await ssh.execCommand('cd /var/www/escortvip && pm2 start npm --name "dizicehennemi-web" -- start');
      console.log('🚀 Dizi server is ONLINE.');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

syncSchemaAndBuild();
