const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');
const path = require('path');

const filesToDeploy = [
  { local: 'config/site.ts', remote: '/var/www/escortvip/config/site.ts' },
  { local: 'next.config.ts', remote: '/var/www/escortvip/next.config.ts' },
  { local: 'components/SEO/DorukVitrin.tsx', remote: '/var/www/escortvip/components/SEO/DorukVitrin.tsx' },
  { local: 'components/SEO/PureAngelVitrin.tsx', remote: '/var/www/escortvip/components/SEO/PureAngelVitrin.tsx' },
  { local: 'components/SEO/VitrinWall.tsx', remote: '/var/www/escortvip/components/SEO/VitrinWall.tsx' },
  { local: 'app/page.tsx', remote: '/var/www/escortvip/app/page.tsx' },
  { local: 'app/profile/[slug]/page.tsx', remote: '/var/www/escortvip/app/profile/[slug]/page.tsx' },
  { local: 'app/layout.tsx', remote: '/var/www/escortvip/app/layout.tsx' },
  { local: 'middleware.ts', remote: '/var/www/escortvip/middleware.ts' },
  { local: 'app/amp/route.ts', remote: '/var/www/escortvip/app/amp/route.ts' }
];

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to server.');

    for (const file of filesToDeploy) {
      const localPath = path.resolve(__dirname, '..', file.local);
      const content = fs.readFileSync(localPath, 'utf8');
      console.log(`Deploying ${file.local} to ${file.remote}...`);
      
      const writeResult = await ssh.execCommand(`cat << 'EOF' > ${file.remote}\n${content}\nEOF`);
      if (writeResult.stderr) {
        console.error(`Error writing ${file.local}:`, writeResult.stderr);
      } else {
        console.log(`Successfully deployed ${file.local}`);
      }
    }

    console.log('Triggering production build on server...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('Build Output:\n', buildResult.stdout || buildResult.stderr);

    if (buildResult.code === 0) {
      console.log('Build succeeded! Reloading PM2...');
      const reloadResult = await ssh.execCommand('pm2 reload escortvip', { cwd: '/var/www/escortvip' });
      console.log('PM2 Reload Output:\n', reloadResult.stdout || reloadResult.stderr);
    } else {
      console.error('Build failed! Reload aborted.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error during deploy:', err);
    ssh.dispose();
  }
})();
