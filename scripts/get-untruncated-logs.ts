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

    console.log('🚀 Running shortener on VPS and logging to file...');
    await ssh.execCommand('node scripts/shorten_and_report_sites.js > shortener.log 2>&1', { cwd: '/root/esc' });
    console.log('✅ Execution complete.');

    console.log('\n📖 --- FULL LOG OUTPUT ---');
    const catRes = await ssh.execCommand('cat shortener.log', { cwd: '/root/esc' });
    console.log(catRes.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
