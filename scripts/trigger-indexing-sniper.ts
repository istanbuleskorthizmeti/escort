import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    console.log('🎯 Running indexing-sniper via npx tsx...');
    const res = await ssh.execCommand('npx tsx scripts/master/indexing-sniper.ts', { cwd: '/root/esc' });
    console.log('Output:\n', res.stdout || res.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
