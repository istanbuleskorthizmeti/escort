import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('📡 SSH Connected to Droplet.');

    // 1. Read local files
    const localMiddlewareContent = fs.readFileSync(path.join(process.cwd(), 'middleware.ts'), 'utf-8');
    const localVitrinContent = fs.readFileSync(path.join(process.cwd(), 'components/SEO/DorukVitrin.tsx'), 'utf-8');

    // 2. Upload middleware.ts
    console.log('📤 Uploading middleware.ts to server...');
    await ssh.execCommand('cp /root/esc/middleware.ts /root/esc/middleware.ts.bak');
    const writeMiddleware = await ssh.execCommand(`cat << 'EOF' > /root/esc/middleware.ts\n${localMiddlewareContent}\nEOF`);
    console.log('Middleware Upload Status:', writeMiddleware.code === 0 ? 'SUCCESS' : 'FAILED', writeMiddleware.stderr);

    // 3. Upload components/SEO/DorukVitrin.tsx
    console.log('📤 Uploading components/SEO/DorukVitrin.tsx to server...');
    await ssh.execCommand('cp /root/esc/components/SEO/DorukVitrin.tsx /root/esc/components/SEO/DorukVitrin.tsx.bak');
    const writeVitrin = await ssh.execCommand(`cat << 'EOF' > /root/esc/components/SEO/DorukVitrin.tsx\n${localVitrinContent}\nEOF`);
    console.log('Vitrin Upload Status:', writeVitrin.code === 0 ? 'SUCCESS' : 'FAILED', writeVitrin.stderr);

    // 4. Run Build Command on Server
    console.log('🏗️ Triggering Next.js Production Build on Server...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('Build Output (STDOUT):\n', buildResult.stdout);
    if (buildResult.stderr && buildResult.code !== 0) {
      console.warn('Build Warning/Error (STDERR):\n', buildResult.stderr);
    }

    // 5. Restart the PM2 Cluster
    console.log('🔄 Reloading PM2 Cluster to apply changes...');
    const restartResult = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log('PM2 Reload Output:\n', restartResult.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Deployment Failed:', err.message);
  }
}

run();
