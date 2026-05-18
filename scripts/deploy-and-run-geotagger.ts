import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployAndRunGeoTagger() {
  try {
    console.log('🚀 [DEPLOY GEOTAGGER] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload pre-compiled nuclear-geotagger.js to VPS
    console.log('📤 [UPLOAD] Uploading compiled nuclear-geotagger.js to VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'dist', 'nuclear-geotagger.js'),
      '/root/esc/dist/nuclear-geotagger.js'
    );
    console.log('✅ Upload complete.');

    // 2. Execute on remote server
    console.log('⚔️ [EXECUTE] Running EXIF Geo-Tagging engine on remote production server...');
    const execRes = await ssh.execCommand('node dist/nuclear-geotagger.js', { cwd: '/root/esc' });
    console.log('\n--- GEOTAGGER ENGINE EXECUTION OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    console.log(execRes.stderr || 'No errors.');

    ssh.dispose();
    console.log('🏁 [COMPLETED] Local GPS Geo-Tagging executed and synced! Google Images dominance is now live.');
  } catch (err: any) {
    console.error('💥 Error during deploy and run Geo-Tagger:', err.message);
    ssh.dispose();
  }
}

deployAndRunGeoTagger();
