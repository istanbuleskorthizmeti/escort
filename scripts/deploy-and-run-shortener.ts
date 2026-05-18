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
    console.log('🚀 [DEPLOY SHORTENER] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    console.log('📤 [UPLOAD] Uploading scripts/shorten_and_report_sites.js to remote VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'shorten_and_report_sites.js'),
      '/root/esc/scripts/shorten_and_report_sites.js'
    );
    console.log('✅ Upload complete.');

    console.log('⚔️ [EXECUTE] Running shortening script on remote VPS...');
    const execRes = await ssh.execCommand('node scripts/shorten_and_report_sites.js', { cwd: '/root/esc' });
    console.log('\n--- REMOTE EXECUTION OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    if (execRes.stderr) {
      console.log('\n--- REMOTE EXECUTION ERRORS ---');
      console.log(execRes.stderr);
    }

    ssh.dispose();
    console.log('🏁 [FINISHED] Execution finished.');
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
