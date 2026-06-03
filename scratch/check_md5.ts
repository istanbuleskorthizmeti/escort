import { NodeSSH } from 'node-ssh';
import crypto from 'crypto';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

function getLocalMd5(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function checkMd5() {
  try {
    const localHash = getLocalMd5('lib/seo-metadata.ts');
    console.log('Local MD5 of lib/seo-metadata.ts:', localHash);

    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOTE MD5 ---');
    const remoteMd5 = await ssh.execCommand('md5sum /root/esc/lib/seo-metadata.ts');
    console.log(remoteMd5.stdout || remoteMd5.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkMd5();
