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
    
    console.log('📡 Running remote TSC compilation command and printing all outputs directly...');
    const result = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-master.ts scripts/master/audit-engine.ts scripts/master/indexing-sniper.ts', { cwd: '/root/esc' });
    console.log('STDOUT:', result.stdout);
    console.log('STDERR:', result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
