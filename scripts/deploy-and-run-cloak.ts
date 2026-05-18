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
    console.log('🚀 [DEPLOY CLOAK ENGINE] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    
    console.log('📤 [UPLOAD] Uploading scripts/create_custom_cloak_links.js to remote VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'create_custom_cloak_links.js'),
      '/root/esc/scripts/create_custom_cloak_links.js'
    );
    console.log('✅ Upload complete.');

    console.log('⚔️ [EXECUTE] Running database cloaking engine on remote VPS...');
    const execRes = await ssh.execCommand('node scripts/create_custom_cloak_links.js', { cwd: '/root/esc' });
    
    console.log('\n--- LIVE REMOTE STDOUT ---');
    console.log(execRes.stdout || 'No output.');
    if (execRes.stderr) {
      console.log('\n--- LIVE REMOTE STDERR ---');
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
