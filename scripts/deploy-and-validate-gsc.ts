import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    console.log('🚀 [DEPLOY GSC VALIDATOR] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload scripts/validate_gsc_corrections.js to remote VPS
    console.log('📤 [UPLOAD] Uploading scripts/validate_gsc_corrections.js to remote VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'validate_gsc_corrections.js'),
      '/root/esc/scripts/validate_gsc_corrections.js'
    );
    console.log('✅ GSC Validator JS file sync complete.');

    // 2. Execute GSC correction validation script on remote VPS natively
    console.log('⚔️ [EXECUTE] Running GSC correction validation script on VPS natively...');
    const execRes = await ssh.execCommand('node scripts/validate_gsc_corrections.js', { cwd: '/root/esc' });
    console.log('\n--- REMOTE EXECUTION OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    if (execRes.stderr) {
      console.log('\n--- REMOTE EXECUTION ERRORS ---');
      console.log(execRes.stderr);
    }

    ssh.dispose();
    console.log('🏁 [FINISHED] GSC API validation run successfully completed.');
  } catch (err: any) {
    console.error('💥 Error during GSC validation run:', err.message);
    ssh.dispose();
  }
}

run();
