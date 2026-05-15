import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remotePath = '/root/hydra';

async function deepSync(dir: string) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect(server);
    console.log(`🚀 Deep Syncing ${dir} to Escort Server...`);

    for (const f of files) {
      const local = path.join(dir, f);
      const remote = path.join(remotePath, dir, f).replace(/\\/g, '/');
      
      if (fs.lstatSync(local).isDirectory()) {
        await ssh.execCommand(`mkdir -p ${remote}`);
        continue;
      }

      console.log(`📄 Writing ${remote}...`);
      const content = fs.readFileSync(local, 'utf8');
      await ssh.execCommand(`cat > ${remote} << 'EOF'\n${content}\nEOF`);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

async function run() {
  await deepSync('app');
  await deepSync('lib');
  await deepSync('config');
  await deepSync('components');
  console.log('✅ ALL CRITICAL DIRECTORIES SYNCED TO ESCORT SERVER.');
}

run();
