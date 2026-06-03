import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function uploadAndBuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('📤 Uploading local app/amp/route.ts to remote server...');
    await ssh.putFile(
      path.resolve('app/amp/route.ts'),
      '/root/esc/app/amp/route.ts'
    );
    console.log('📤 Uploading local middleware.ts to remote server...');
    await ssh.putFile(
      path.resolve('middleware.ts'),
      '/root/esc/middleware.ts'
    );
    console.log('📤 Uploading local next.config.ts to remote server...');
    await ssh.putFile(
      path.resolve('next.config.ts'),
      '/root/esc/next.config.ts'
    );
    console.log('📤 Uploading local app/layout.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/layout.tsx'),
      '/root/esc/app/layout.tsx'
    );
    console.log('📤 Uploading local app/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/page.tsx'),
      '/root/esc/app/page.tsx'
    );
    console.log('📤 Uploading local app/widget/vitrin/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/widget/vitrin/page.tsx'),
      '/root/esc/app/widget/vitrin/page.tsx'
    );
    console.log('📤 Uploading local app/[city]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/[city]/page.tsx'),
      '/root/esc/app/[city]/page.tsx'
    );
    console.log('📤 Uploading local app/[city]/[district]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/[city]/[district]/page.tsx'),
      '/root/esc/app/[city]/[district]/page.tsx'
    );
    console.log('📤 Uploading local app/ansiklopedi/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/ansiklopedi/[slug]/page.tsx'),
      '/root/esc/app/ansiklopedi/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/blog/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/blog/[slug]/page.tsx'),
      '/root/esc/app/blog/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/experts/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/experts/[slug]/page.tsx'),
      '/root/esc/app/experts/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/p/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/p/[slug]/page.tsx'),
      '/root/esc/app/p/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/s/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/s/[slug]/page.tsx'),
      '/root/esc/app/s/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/subeler/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/subeler/[slug]/page.tsx'),
      '/root/esc/app/subeler/[slug]/page.tsx'
    );
    console.log('📤 Uploading local app/video/[niche]/[slug]/page.tsx to remote server...');
    await ssh.putFile(
      path.resolve('app/video/[niche]/[slug]/page.tsx'),
      '/root/esc/app/video/[niche]/[slug]/page.tsx'
    );
    console.log('✅ Upload complete.');

    console.log('🗑️ Removing Next.js cache...');
    await ssh.execCommand('rm -rf /root/esc/.next');

    console.log('🏗️ Rebuilding Next.js application...');
    const result = await ssh.execCommand('export UV_THREADPOOL_SIZE=1 && export NODE_OPTIONS="--max-old-space-size=2048" && npm run build', { cwd: '/root/esc' });
    console.log('\n--- BUILD STDOUT ---');
    console.log(result.stdout);
    console.log('\n--- BUILD STDERR ---');
    console.log(result.stderr);

    console.log('🚀 [PM2] Restarting processes...');
    await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🎉 Done! Checking PM2 status...');
    const status = await ssh.execCommand('pm2 status');
    console.log(status.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Upload & build failed:', err);
    ssh.dispose();
  }
}

uploadAndBuild();
