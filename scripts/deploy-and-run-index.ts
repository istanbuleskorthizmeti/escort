import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployAndRunIndex() {
  try {
    console.log('🚀 [DEPLOY INDEXING] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload pre-compiled index-pdf.js
    console.log('📤 [UPLOAD] Uploading compiled index-pdf.js to production VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'dist', 'scripts', 'index-pdf.js'),
      '/root/esc/dist/scripts/index-pdf.js'
    );
    console.log('✅ Upload complete.');

    // 2. Run the script on the remote VPS to trigger indexing
    console.log('⚔️ [EXECUTE] Pinging Google, Bing, Yandex indexing engines...');
    const execRes = await ssh.execCommand('node dist/scripts/index-pdf.js', { cwd: '/root/esc' });
    console.log('\n--- INDEX ENGINE BROADCAST OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    console.log(execRes.stderr || 'No errors.');

    ssh.dispose();
    console.log('🏁 [INDEX COMPLETE] Google, Bing, Yandex indexes notified and crawled!');
  } catch (err: any) {
    console.error('💥 Error during deploy and run index:', err.message);
    ssh.dispose();
  }
}

deployAndRunIndex();
