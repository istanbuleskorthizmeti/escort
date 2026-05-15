import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function injectBuildId() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('💉 Injecting BUILD_ID to Escort Server...');
    
    await ssh.execCommand('echo "god-mode-v1" > /root/hydra/.next/BUILD_ID');
    console.log('✅ BUILD_ID injected.');

    console.log('♻️ Restarting app...');
    await ssh.execCommand('pm2 delete hydra-web || true');
    await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
    
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

injectBuildId();
