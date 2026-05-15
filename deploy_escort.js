const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deploy() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected to 213.232.235.181');

    const files = [
      { local: 'next.config.ts', remote: '/root/esc/next.config.ts' },
      { local: 'app/layout.tsx', remote: '/root/esc/app/layout.tsx' },
      { local: 'app/globals.css', remote: '/root/esc/app/globals.css' },
      { local: 'app/page.tsx', remote: '/root/esc/app/page.tsx' },
      { local: 'app/[city]/page.tsx', remote: '/root/esc/app/[city]/page.tsx' },
      { local: 'app/[city]/[district]/page.tsx', remote: '/root/esc/app/[city]/[district]/page.tsx' },
      { local: 'lib/ai-seo.ts', remote: '/root/esc/lib/ai-seo.ts' },
      { local: 'lib/mathematical-seo.ts', remote: '/root/esc/lib/mathematical-seo.ts' },
      { local: 'components/SEO/IstanbulConquestMatrix.tsx', remote: '/root/esc/components/SEO/IstanbulConquestMatrix.tsx' },
      { local: 'components/UI/Navbar.tsx', remote: '/root/esc/components/UI/Navbar.tsx' },
      { local: 'components/UI/ConciergeSuite.tsx', remote: '/root/esc/components/UI/ConciergeSuite.tsx' }
    ];

    for (const file of files) {
      console.log(`Uploading ${file.local}...`);
      await ssh.putFile(file.local, file.remote);
    }

    console.log('All files uploaded. Triggering build...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('Build STDOUT:\n' + buildResult.stdout);
    console.log('Build STDERR:\n' + buildResult.stderr);

    console.log('Restarting PM2...');
    const pm2Result = await ssh.execCommand('pm2 restart esc-live hydra-live', { cwd: '/root/esc' });
    console.log('PM2 STDOUT:\n' + pm2Result.stdout);

    console.log('Deployment complete!');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

deploy();
