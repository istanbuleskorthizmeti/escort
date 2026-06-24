import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function deployGoogleKey() {
  try {
    console.log('🚀 [DEPLOY GOOGLE KEY] Connecting to root@31.97.79.34...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload key files to /root/esc/
    const keysToUpload = ['google-key.json', 'hydra-gcp-key.json', 'google-key-strong-return.json'];
    console.log('📤 [UPLOAD] Uploading GSC service account keys to production VPS...');
    for (const keyFile of keysToUpload) {
      const localPath = path.join(process.cwd(), keyFile);
      if (fs.existsSync(localPath)) {
        await ssh.putFile(localPath, `/root/esc/${keyFile}`);
        await ssh.putFile(localPath, `/root/esc/dist/${keyFile}`);
        console.log(`✅ Uploaded ${keyFile} to both root and dist directories.`);
      } else {
        console.warn(`⚠️ Warning: Local key file not found: ${keyFile}`);
      }
    }

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
