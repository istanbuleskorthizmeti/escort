import { NodeSSH } from 'node-ssh';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function deployZip() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Sending deploy.zip to Escort Server...');
    
    await ssh.putFile('./deploy.zip', '/root/hydra/deploy.zip');
    console.log('✅ deploy.zip uploaded.');

    console.log('📦 Unzipping...');
    await ssh.execCommand('cd /root/hydra && unzip -o deploy.zip && rm deploy.zip');
    console.log('✅ Unzipped and cleaned up.');

    console.log('🏗️ Triggering Production Build...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build Success! Restarting hydra-web...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('pkill -9 node || true');
      await ssh.execCommand('fuser -k 3001/tcp || true');
      await ssh.execCommand('pm2 start npm --name "hydra-web" --cwd /root/hydra -- start -- -p 3001');
      console.log('🚀 Escort Server is ONLINE and STABLE.');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

deployZip();
