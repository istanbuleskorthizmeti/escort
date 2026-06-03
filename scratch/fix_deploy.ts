import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function fixAndRebuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🗑️ Removing stale /root/esc/app/amp/page.tsx...');
    await ssh.execCommand('rm -f /root/esc/app/amp/page.tsx');

    console.log('🗑️ Cleaning Next.js cache and build directories...');
    await ssh.execCommand('rm -rf /root/esc/.next');

    console.log('🏗️ Building Next.js production bundle on server...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('\n--- BUILD STDOUT ---');
    console.log(buildResult.stdout);
    console.log('\n--- BUILD STDERR ---');
    console.log(buildResult.stderr);

    console.log('🔗 [PRISMA GENERATE] Generating Prisma Client...');
    await ssh.execCommand('npx prisma generate', { cwd: '/root/esc' });

    console.log('🚀 [PM2] Restarting all processes...');
    const pm2Result = await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(pm2Result.stdout);

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🎉 Done! Checking PM2 status...');
    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Fix script failed:', err);
    ssh.dispose();
  }
}

fixAndRebuild();
