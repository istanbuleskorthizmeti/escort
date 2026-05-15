import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function resolveConflicts() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Resolving Route Conflicts on Dizi Server...');
    
    // 1. Remove conflicting sitemap routes
    await ssh.execCommand('rm -rf /var/www/escortvip/app/sitemap.xml/route.ts || true');
    await ssh.execCommand('rm -rf /var/www/escortvip/app/sitemap.xml/route.js || true');
    
    // 2. Remove conflicting amp routes
    await ssh.execCommand('rm -rf /var/www/escortvip/app/amp/route.ts || true');
    await ssh.execCommand('rm -rf /var/www/escortvip/app/amp/route.js || true');

    console.log('✅ Conflicts removed.');

    // 3. Build again
    console.log('🏗️ Building again...');
    const buildRes = await ssh.execCommand('cd /var/www/escortvip && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

resolveConflicts();
