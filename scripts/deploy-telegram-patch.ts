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

    const localPath = path.resolve('lib/telegram.ts');
    const remotePath = '/root/esc/lib/telegram.ts';

    console.log(`📤 Uploading patched lib/telegram.ts to VPS...`);
    await ssh.putFile(localPath, remotePath);
    console.log('✅ Patched file uploaded.');

    console.log('🔄 Restarting PM2 Cluster for Next.js to load new code...');
    const restartRes = await ssh.execCommand('pm2 reload drkcnay-web-cluster', { cwd: '/root/esc' });
    console.log('PM2 Output:\n', restartRes.stdout || restartRes.stderr);

    console.log('🎉 Telegram patch deployed successfully.');
  } catch (err: any) {
    console.error('💥 Patch Deploy Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
