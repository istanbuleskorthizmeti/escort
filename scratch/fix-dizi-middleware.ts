import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function fixMiddlewareAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Fixing Middleware Conflict on Dizi Server...');
    
    // 1. Rename middleware.ts if it exists
    await ssh.execCommand('mv /var/www/escortvip/middleware.ts /var/www/escortvip/middleware.ts.bak || true');
    console.log('✅ middleware.ts renamed to .bak');

    // 2. Build again
    console.log('🏗️ Building again...');
    const buildRes = await ssh.execCommand('cd /var/www/escortvip && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    // 3. Restart
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

fixMiddlewareAndBuild();
