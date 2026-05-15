import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function diziSurgicalBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Surgical Build Attempt on Dizi Server...');
    
    // 1. Resolve conflicts (already tried but to be sure)
    await ssh.execCommand('rm -rf /var/www/escortvip/app/sitemap.xml/route.ts || true');
    await ssh.execCommand('rm -rf /var/www/escortvip/app/amp/route.ts || true');
    console.log('✅ Conflicts cleared.');

    // 2. Build
    console.log('🏗️ Building...');
    const buildRes = await ssh.execCommand('cd /var/www/escortvip && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    // 3. Restart if success
    if (buildRes.code === 0) {
      console.log('✅ BUILD SUCCESS! Starting app...');
      await ssh.execCommand('pm2 delete dizicehennemi-web || true');
      await ssh.execCommand('cd /var/www/escortvip && pm2 start npm --name "dizicehennemi-web" -- start');
      console.log('🚀 DIZI SERVER IS ONLINE!');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

diziSurgicalBuild();
