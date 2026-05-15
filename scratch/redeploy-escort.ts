import { NodeSSH } from 'node-ssh';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function redeploy() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Redeploying to Escort Server...');

    // 1. Upload the tarball
    console.log('📤 Uploading hydra.tar.gz...');
    await ssh.putFile(path.join(process.cwd(), 'hydra.tar.gz'), '/root/hydra.tar.gz');

    // 2. Extract and Setup
    console.log('📦 Extracting and Setting up...');
    const commands = [
      'mkdir -p /root/hydra_new',
      'tar -xzf /root/hydra.tar.gz -C /root/hydra_new',
      'cp /root/hydra/.env /root/hydra_new/.env || true', // Try to keep .env if exists
      'cd /root/hydra_new && npm install --force && npx prisma generate && npm run build',
      'rm -rf /root/hydra_old',
      'mv /root/hydra /root/hydra_old || true',
      'mv /root/hydra_new /root/hydra',
      'pm2 restart hydra-web'
    ];

    for (const cmd of commands) {
       console.log(`🏃 Running: ${cmd}`);
       const result = await ssh.execCommand(cmd, { cwd: '/root' });
       if (result.stderr && !cmd.includes('|| true')) {
         console.warn(`⚠️ Warning/Error: ${result.stderr}`);
       }
    }

    console.log('✅ Deployment Successful!');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ DEPLOY FAILED:', err.message);
  }
}

redeploy();
