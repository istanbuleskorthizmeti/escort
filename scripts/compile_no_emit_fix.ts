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
    
    console.log('📡 Running remote TSC compilation command with --noEmit false override...');
    const result = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --noEmit false --outDir dist_scripts scripts/master/telegram-master.ts scripts/master/audit-engine.ts scripts/master/indexing-sniper.ts', { cwd: '/root/esc' });
    console.log('STDOUT:', result.stdout);
    console.log('STDERR:', result.stderr);

    console.log('📡 Listing files inside dist_scripts/ directly...');
    const listRes = await ssh.execCommand('ls -la dist_scripts || ls -la dist_scripts/master || find dist_scripts', { cwd: '/root/esc' });
    console.log(listRes.stdout || listRes.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
