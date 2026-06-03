const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path');

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('Connected to server via port 2222.');

    // 1. Upload lib/seo-metadata.ts
    console.log('Uploading lib/seo-metadata.ts...');
    await ssh.putFile(
      path.join(__dirname, '../lib/seo-metadata.ts'),
      '/root/esc/lib/seo-metadata.ts'
    );
    console.log('Uploaded lib/seo-metadata.ts');

    // 2. Upload lib/seo/sitemap-generator.ts
    console.log('Uploading lib/seo/sitemap-generator.ts...');
    await ssh.putFile(
      path.join(__dirname, '../lib/seo/sitemap-generator.ts'),
      '/root/esc/lib/seo/sitemap-generator.ts'
    );
    console.log('Uploaded lib/seo/sitemap-generator.ts');

    // 2b. Upload app/api/seo/route.ts
    console.log('Uploading app/api/seo/route.ts...');
    await ssh.putFile(
      path.join(__dirname, '../app/api/seo/route.ts'),
      '/root/esc/app/api/seo/route.ts'
    );
    console.log('Uploaded app/api/seo/route.ts');

    // 2c. Upload app/api/test-db-route/route.ts
    console.log('Uploading app/api/test-db-route/route.ts...');
    await ssh.execCommand('mkdir -p /root/esc/app/api/test-db-route');
    await ssh.putFile(
      path.join(__dirname, '../app/api/test-db-route/route.ts'),
      '/root/esc/app/api/test-db-route/route.ts'
    );
    console.log('Uploaded app/api/test-db-route/route.ts');

    // 2d. Upload lib/site-context.ts
    console.log('Uploading lib/site-context.ts...');
    await ssh.putFile(
      path.join(__dirname, '../lib/site-context.ts'),
      '/root/esc/lib/site-context.ts'
    );
    console.log('Uploaded lib/site-context.ts');

    // 3. Build Next.js app on the server
    console.log('Building Next.js application on the server (npm run build)...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('Build exit code:', buildRes.code);
    console.log('Build stdout snapshot:\n', buildRes.stdout.slice(-1000));
    if (buildRes.code !== 0) {
      console.error('Build failed with errors:\n', buildRes.stderr);
      return;
    }

    // 4. Reload PM2 services to apply the new bundle
    console.log('Reloading PM2 services...');
    const reloadRes = await ssh.execCommand('pm2 reload all', { cwd: '/root/esc' });
    console.log('PM2 Reload status:', reloadRes.stdout || reloadRes.stderr);

    console.log('🚀 Deployment completed successfully!');

  } catch(e) {
    console.error('Deployment error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
