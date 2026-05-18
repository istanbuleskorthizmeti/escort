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
    console.log('🚀 [DEPLOY BITLY ENGINE] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload updated lib/seo/bitly.ts to VPS
    console.log('📤 [UPLOAD] Uploading lib/seo/bitly.ts to VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'lib', 'seo', 'bitly.ts'),
      '/root/esc/lib/seo/bitly.ts'
    );
    console.log('✅ lib/seo/bitly.ts upload complete.');

    // 2. Upload scripts/shorten_and_report_sites.ts to VPS
    console.log('📤 [UPLOAD] Uploading scripts/shorten_and_report_sites.ts to VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'shorten_and_report_sites.ts'),
      '/root/esc/scripts/shorten_and_report_sites.ts'
    );
    console.log('✅ scripts/shorten_and_report_sites.ts upload complete.');

    // 3. Execute shortening script on VPS via npx tsx
    console.log('⚔️ [EXECUTE] Running Bitly shortener on remote VPS via tsx...');
    const execRes = await ssh.execCommand('npx tsx scripts/shorten_and_report_sites.ts', { cwd: '/root/esc' });
    
    console.log('\n--- REMOTE EXECUTION OUTPUT ---');
    console.log(execRes.stdout || 'No output.');
    if (execRes.stderr) {
      console.log('\n--- REMOTE EXECUTION ERRORS ---');
      console.log(execRes.stderr);
    }

    ssh.dispose();
    console.log('🏁 [FINISHED] Bitly deployment and shortening complete.');
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
