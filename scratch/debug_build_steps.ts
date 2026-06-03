import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function debugBuildSteps() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- 1. RUNNING PRISMA GENERATE ---');
    const prismaRes = await ssh.execCommand('npx prisma generate', { cwd: '/root/esc' });
    console.log('STDOUT:', prismaRes.stdout);
    console.log('STDERR:', prismaRes.stderr);

    console.log('\n--- 2. RUNNING SITEMAP GENERATION ---');
    const sitemapRes = await ssh.execCommand('node scripts/generate_dynamic_sitemap.js', { cwd: '/root/esc' });
    console.log('STDOUT:', sitemapRes.stdout);
    console.log('STDERR:', sitemapRes.stderr);

    console.log('\n--- 3. RUNNING NEXT BUILD DIRECTLY ---');
    const buildRes = await ssh.execCommand('npx next build', {
      cwd: '/root/esc',
      env: {
        NODE_OPTIONS: '--max-old-space-size=2048'
      }
    });
    console.log('STDOUT:', buildRes.stdout);
    console.log('STDERR:', buildRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

debugBuildSteps();
