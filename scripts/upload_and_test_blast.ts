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
    
    console.log('📤 Uploading updated telegram-blast.ts...');
    const localBlast = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'telegram-blast.ts'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/telegram-blast.ts\n${localBlast}\nEOF`);

    console.log('📡 Executing a manual Telegram visual SEO blast test run using ts-node...');
    const result = await ssh.execCommand('npx ts-node scripts/master/telegram-blast.ts', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
