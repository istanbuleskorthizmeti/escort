import { NodeSSH } from 'node-ssh';
import * as path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected to VPS.');

    const localContentPath = path.resolve('lib/seo-content.ts');
    const remoteContentPath = '/root/esc/lib/seo-content.ts';

    console.log('📤 Uploading updated lib/seo-content.ts to VPS...');
    await ssh.putFile(localContentPath, remoteContentPath);
    console.log('✅ Uploaded lib/seo-content.ts.');

    console.log('🏗️ Building Next.js application on VPS (next build)... This may take 1-2 minutes...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('Build Output:\n', buildRes.stdout);
    
    if (buildRes.code !== 0) {
      console.error('❌ Build Failed! Error Output:\n', buildRes.stderr);
      return;
    }

    console.log('🔄 Restarting PM2 Cluster for Next.js (pm2 reload)...');
    const restartRes = await ssh.execCommand('pm2 reload drkcnay-web-cluster', { cwd: '/root/esc' });
    console.log('PM2 Output:\n', restartRes.stdout || restartRes.stderr);

    console.log('🎉 Deploy and remote rebuild finished successfully.');
  } catch (err: any) {
    console.error('💥 Deploy/Build Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
