import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📤 Uploading updated telegram-master.ts to droplet...');
    const localMaster = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'telegram-master.ts'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/telegram-master.ts\n${localMaster}\nEOF`);

    console.log('🚀 Running remote tsc build directly...');
    const buildRes = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-master.ts', { cwd: '/root/esc' });
    console.log(buildRes.stdout || buildRes.stderr || 'Build executed.');

    console.log('🔄 Restarting the hydra-telegram-bot PM2 process to apply dotenv dynamic loading...');
    await ssh.execCommand('pm2 restart hydra-telegram-bot');
    
    console.log('💾 Saving PM2 process configurations...');
    await ssh.execCommand('pm2 save');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
