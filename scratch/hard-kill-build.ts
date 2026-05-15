import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function hardKillAndBuild() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('💀 [ESCORT] Hard killing ALL node/next processes...');
    // We kill everything node-related to be sure
    await ssh.execCommand('pkill -9 -f node || true');
    await ssh.execCommand('pkill -9 -f next || true');
    
    console.log('🏗️ [ESCORT] Starting FRESH BUILD...');
    await ssh.execCommand('rm -f build.log', { cwd: '/root/hydra' });
    await ssh.execCommand('npm run build > build.log 2>&1 &', { cwd: '/root/hydra' });
    
    console.log('✅ [ESCORT] Fresh build started. Check with tail -f /root/hydra/build.log');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

hardKillAndBuild();
