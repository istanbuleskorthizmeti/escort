import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🚀 [REMOTE-GA4] Connecting to VPS 187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('📤 Uploading lib/seo/ga4.ts to VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'lib/seo/ga4.ts'),
      '/var/www/escortvip/lib/seo/ga4.ts'
    );

    console.log('📤 Uploading scripts/run-ga4-report.ts to VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts/run-ga4-report.ts'),
      '/var/www/escortvip/scripts/run-ga4-report.ts'
    );

    console.log('📡 [EXEC] Running run-ga4-report.ts...');
    const execRes = await ssh.execCommand('npx tsx scripts/run-ga4-report.ts', { cwd: '/var/www/escortvip' });
    console.log('Stdout:\n', execRes.stdout);
    console.log('Stderr:\n', execRes.stderr);

    ssh.dispose();
    console.log('🏁 [FINISHED]');
  } catch (err: any) {
    console.error('💥 Execution failed:', err.message);
    ssh.dispose();
  }
}

run();
