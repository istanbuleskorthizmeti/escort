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
    
    console.log('📤 Uploading stream-fixed telegram-blast.ts...');
    const localBlast = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'telegram-blast.ts'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/telegram-blast.ts\n${localBlast}\nEOF`);

    console.log('🚀 Compiling target master scripts via TSC...');
    const compileRes = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-blast.ts', { cwd: '/root/esc' });
    console.log(compileRes.stdout || compileRes.stderr || 'Compiled.');

    console.log('📡 Executing the new stream-based visual SEO blast on the droplet...');
    const blastRes = await ssh.execCommand('node -r dotenv/config dist_scripts/scripts/master/telegram-blast.js', { cwd: '/root/esc' });
    console.log(blastRes.stdout || blastRes.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
