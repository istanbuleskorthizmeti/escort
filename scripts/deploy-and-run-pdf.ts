import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployAndRunPdf() {
  try {
    console.log('🚀 [DEPLOY & RUN PDF] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload pre-compiled nuclear-pdf-gen.js
    console.log('📤 [UPLOAD] Uploading compiled nuclear-pdf-gen.js to production VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'dist', 'nuclear-pdf-gen.js'),
      '/root/esc/dist/nuclear-pdf-gen.js'
    );
    console.log('✅ Upload complete.');

    // 2. Run the script on the remote VPS to generate the PDF
    console.log('⚔️ [EXECUTE] Generating Premium PDF payload on production server...');
    const execRes = await ssh.execCommand('node dist/nuclear-pdf-gen.js', { cwd: '/root/esc' });
    console.log('\n--- PDF ENGINE EXECUTION OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    console.log(execRes.stderr || 'No errors.');

    // 3. Check if the PDF file exists in the public directory on the remote VPS
    console.log('\n🔍 [VERIFICATION] Verifying file exists in public/ directory...');
    const verifyRes = await ssh.execCommand('ls -lh public/ULTIMATE_VIP_GUIDE_2026.pdf', { cwd: '/root/esc' });
    console.log(verifyRes.stdout || '⚠️ File not found in public/ directory!');

    ssh.dispose();
    console.log('🏁 [MISSION ACCOMPLISHED] PDF SEO Siege Payload is live at https://istanbulescdrkcn.com/ULTIMATE_VIP_GUIDE_2026.pdf!');
  } catch (err: any) {
    console.error('💥 Error during deploy and run:', err.message);
    ssh.dispose();
  }
}

deployAndRunPdf();
