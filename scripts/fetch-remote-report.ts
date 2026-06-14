import { NodeSSH } from 'node-ssh';
import * as path from 'path';
import * as fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    const remotePath = '/root/esc/artifacts/gsc_ga4_insights_report.md';
    const localPath = path.join(process.cwd(), 'artifacts', 'gsc_ga4_insights_report.md');

    console.log(`📥 Downloading ${remotePath} to ${localPath}...`);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    await ssh.getFile(localPath, remotePath);
    console.log('✅ Download complete.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
