import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('🧹 [CLEAN] Purging temp tsx/esbuild daemon sockets & caches...');
    await ssh.execCommand('rm -rf /tmp/tsx-* || true');
    await ssh.execCommand('rm -rf /root/.cache/esbuild || true');
    
    console.log('📡 Attempting run after cache purge...');
    const result = await ssh.execCommand('npx tsx scripts/master/telegram-blast.ts', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
