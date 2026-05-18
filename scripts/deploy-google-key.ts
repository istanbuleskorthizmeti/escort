import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployGoogleKey() {
  try {
    console.log('🚀 [DEPLOY GOOGLE KEY] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload google-key.json to /root/esc/google-key.json
    console.log('📤 [UPLOAD] Uploading google-key.json to production VPS (both roots)...');
    await ssh.putFile(
      path.join(process.cwd(), 'google-key.json'),
      '/root/esc/google-key.json'
    );
    await ssh.putFile(
      path.join(process.cwd(), 'google-key.json'),
      '/root/esc/dist/google-key.json'
    );
    console.log('✅ google-key.json uploaded to both root and dist roots successfully.');

    // 2. Re-trigger indexing to execute Google Indexing API publish
    console.log('⚔️ [RE-EXECUTE] Triggering multi-platform Indexing with Google Search Console active...');
    const execRes = await ssh.execCommand('node dist/scripts/index-pdf.js', { cwd: '/root/esc' });
    console.log('\n--- INDEX ENGINE BROADCAST OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    console.log(execRes.stderr || 'No errors.');

    ssh.dispose();
    console.log('🏁 [COMPLETED] Google Search Console API active! Real-time indexation triggered.');
  } catch (err: any) {
    console.error('💥 Error deploying Google Key:', err.message);
    ssh.dispose();
  }
}

deployGoogleKey();
