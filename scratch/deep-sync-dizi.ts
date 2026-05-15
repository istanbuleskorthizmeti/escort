import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };
const remotePath = '/var/www/escortvip';

async function deepSync(dir: string) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect(server);
    console.log(`🚀 Deep Syncing ${dir} to Dizi Server...`);

    for (const f of files) {
      const local = path.join(dir, f);
      const remote = path.join(remotePath, dir, f).replace(/\\/g, '/');
      
      if (fs.lstatSync(local).isDirectory()) {
        await ssh.execCommand(`mkdir -p ${remote}`);
        continue;
      }

      console.log(`📄 Writing ${remote}...`);
      const content = fs.readFileSync(local, 'utf8');
      // Use a safer way to write large files if needed, but cat << 'EOF' is okay for most code
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
  console.log('✅ ALL CRITICAL DIRECTORIES SYNCED.');
}

run();
