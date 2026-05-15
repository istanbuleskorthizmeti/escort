import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remotePath = '/root/hydra';

async function robustSync(dir: string) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect(server);
    console.log(`🛡️ Robust Syncing ${dir} to Escort Server (Base64 Mode)...`);

    for (const f of files) {
      const local = path.join(dir, f);
      const remote = path.join(remotePath, dir, f).replace(/\\/g, '/');
      
      if (fs.lstatSync(local).isDirectory()) {
        await ssh.execCommand(`mkdir -p ${remote}`);
        continue;
      }

      console.log(`📄 Writing ${remote}...`);
      const content = fs.readFileSync(local).toString('base64');
      // Write base64 to temp file and decode
      await ssh.execCommand(`echo "${content}" > ${remote}.tmp && base64 -d ${remote}.tmp > ${remote} && rm ${remote}.tmp`);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

async function run() {
  await robustSync('app');
  console.log('✅ APP DIRECTORY RE-SYNCED ROBUSTLY.');
}

run();
