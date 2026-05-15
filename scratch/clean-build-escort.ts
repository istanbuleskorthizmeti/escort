import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function cleanBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🧹 [ESCORT] Killing all next-build processes...');
    await ssh.execCommand('pkill -f next-build || true');
    await ssh.execCommand('pkill -f "next build" || true');
    
    console.log('🏗️ [ESCORT] Starting ONE CLEAN BUILD in background...');
    // We clear the log first
    await ssh.execCommand('rm -f build.log', { cwd: '/root/hydra' });
    await ssh.execCommand('npm run build > build.log 2>&1 &', { cwd: '/root/hydra' });
    
    console.log('✅ [ESCORT] Clean build started. Monitor with tail -f /root/hydra/build.log');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

cleanBuild();
