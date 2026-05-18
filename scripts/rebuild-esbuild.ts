import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    console.log('🚀 [REBUILD ESBUILD] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('⚙️ Rebuilding esbuild on remote VPS to fix EPIPE architecture mismatch...');
    const rebuildRes = await ssh.execCommand('npm rebuild esbuild', { cwd: '/root/esc' });
    console.log('STDOUT:', rebuildRes.stdout || 'None');
    console.log('STDERR:', rebuildRes.stderr || 'None');

    console.log('⚔️ Let\'s also run a test to see if tsx works now:');
    const testRes = await ssh.execCommand('npx tsx scripts/shorten_and_report_sites.ts', { cwd: '/root/esc' });
    console.log('TEST STDOUT:', testRes.stdout || 'None');
    console.log('TEST STDERR:', testRes.stderr || 'None');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
