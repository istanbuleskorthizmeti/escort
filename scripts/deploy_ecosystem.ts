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
    
    console.log('📤 Uploading fixed ecosystem.config.js...');
    const localEcosystem = fs.readFileSync(path.join(process.cwd(), 'ecosystem.config.js'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/ecosystem.config.js\n${localEcosystem}\nEOF`);

    console.log('🛑 Deleting current PM2 configurations...');
    await ssh.execCommand('pm2 delete all || true');

    console.log('🚀 Loading ecosystem.config.js...');
    const pm2Res = await ssh.execCommand('pm2 start /root/esc/ecosystem.config.js');
    console.log(pm2Res.stdout || pm2Res.stderr || 'PM2 started.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
