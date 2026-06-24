import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';
import * as path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    const sovereignPath = path.resolve('google-key-sovereign.json');
    const mainKeyPath = path.resolve('google-key.json');

    if (!fs.existsSync(sovereignPath)) {
      throw new Error('google-key-sovereign.json not found locally!');
    }

    console.log('🔄 Overwriting local google-key.json with google-key-sovereign.json...');
    fs.copyFileSync(sovereignPath, mainKeyPath);
    console.log('✅ Overwritten locally.');

    await ssh.connect(config);
    console.log('✅ SSH Connected to VPS.');

    console.log('📤 Uploading updated google-key.json to VPS...');
    await ssh.putFile(mainKeyPath, '/root/esc/google-key.json');
    console.log('✅ Uploaded to VPS.');

    console.log('📡 Triggering remote multi-domain report to deliver immediate rankings for all 90 domains...');
    const reportRes = await ssh.execCommand('npx tsx scripts/gsc-multi-domain-report.ts', { cwd: '/root/esc' });
    console.log('Report Output:\n', reportRes.stdout || reportRes.stderr);

    console.log('🎉 Key deployment and reporting completed successfully.');
  } catch (err: any) {
    console.error('💥 Key Patch Deploy Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
