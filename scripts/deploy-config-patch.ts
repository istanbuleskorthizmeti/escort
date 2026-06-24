import { NodeSSH } from 'node-ssh';
import * as path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected to VPS.');

    const localPath = path.resolve('config/domains.ts');
    const remotePath = '/root/esc/config/domains.ts';

    console.log(`📤 Uploading updated config/domains.ts to VPS...`);
    await ssh.putFile(localPath, remotePath);
    console.log('✅ Config file uploaded.');

    console.log('🔄 Restarting PM2 Cluster for Next.js to load new config...');
    const restartRes = await ssh.execCommand('pm2 reload drkcnay-web-cluster', { cwd: '/root/esc' });
    console.log('PM2 Output:\n', restartRes.stdout || restartRes.stderr);

    console.log('🎉 Domain configuration patch deployed successfully.');
  } catch (err: any) {
    console.error('💥 Config Deploy Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
