import { NodeSSH } from 'node-ssh';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployAndRun() {
  try {
    console.log('🚀 [CONNECTING] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload updated engine and report script
    const files = [
      { local: 'lib/seo/github-engine.ts', remote: '/root/esc/lib/seo/github-engine.ts' },
      { local: 'scripts/master-consolidated-report.js', remote: '/root/esc/scripts/master-consolidated-report.js' }
    ];

    for (const f of files) {
      console.log(`📤 Uploading: ${f.local} -> ${f.remote}`);
      const remoteDir = path.dirname(f.remote);
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(path.join(process.cwd(), f.local), f.remote);
    }
    console.log('✅ Files uploaded successfully.');

    // 2. Run consolidated report on the remote server
    console.log('📡 [EXEC] Running Master Consolidated Report on Remote Server...');
    const result = await ssh.execCommand('node scripts/master-consolidated-report.js', { cwd: '/root/esc' });
    
    console.log('\n🌟 <b>MASTER OPERATIONAL REPORT RESULT:</b>\n');
    console.log('STDOUT:\n', result.stdout);
    console.log('STDERR:\n', result.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error running remote dashboard deployment:', err.message);
    ssh.dispose();
  }
}

deployAndRun();
