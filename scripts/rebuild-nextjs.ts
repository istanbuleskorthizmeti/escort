import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🚀 [NEXT.js REBUILD & RESTART] Rebuilding codebase on the production server...');
  console.log('---------------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    // 1. Sync app/amp/route.ts from local to the server
    console.log(' • Syncing app/amp/route.ts to the remote server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\app\\amp\\route.ts', '/var/www/escortvip/app/amp/route.ts');
    console.log('   ✔ Synced.');

    // 2. Run Next.js build
    console.log(' • Compiling Next.js production build...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('--- BUILD OUTPUT ---');
    console.log(buildRes.stdout || buildRes.stderr);

    if (buildRes.code !== 0) {
      console.error('❌ Build failed with exit code', buildRes.code);
      return;
    }

    // 3. Restart PM2 process
    console.log(' • Restarting Next.js process in PM2...');
    const restartRes = await ssh.execCommand('pm2 restart esc-live');
    console.log(restartRes.stdout || restartRes.stderr);
    console.log('   ✔ Process restarted.');

    console.log('\n🏆 [SUCCESS] Mobile SEO LCP optimization is compiled and live in production!');

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
