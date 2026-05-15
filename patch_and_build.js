const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function run() {
  console.log('Connecting...');
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  
  const filesToSync = [
    'lib/seo/traffic-monster.ts',
    'components/SEO/DorukVitrin.tsx',
    'lib/vitrin-images.ts',
    'app/layout.tsx',
    'components/SEO/UltraFooter.tsx',
    'app/[city]/[district]/page.tsx',
    'app/[city]/page.tsx',
    'app/[city]/[district]/[neighborhood]/page.tsx',
    'app/page.tsx',
    'app/[...slug]/page.tsx',
    'app/subdomain/[slug]/page.tsx',
    'app/profile/[slug]/page.tsx',
    'components/UI/Navbar.tsx',
    'config/site.ts'
  ];

  for (const f of filesToSync) {
    console.log('Uploading', f);
    const content = fs.readFileSync(f, 'utf8');
    const b64 = Buffer.from(content).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /root/esc/${f}`);
  }

  console.log('Stopping PM2...');
  await ssh.execCommand('pm2 stop all', { cwd: '/root/esc' });

  console.log('Building on server...');
  const buildRes = await ssh.execCommand('npx next build', { cwd: '/root/esc' });
  console.log(buildRes.stdout);
  if (buildRes.stderr) console.log(buildRes.stderr);

  console.log('Restarting PM2...');
  await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js', { cwd: '/root/esc' });
  
  console.log('DONE!');
  ssh.dispose();
}

run().catch(console.error);
