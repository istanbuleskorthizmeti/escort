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
    
    console.log('📤 Uploading updated ecosystem.config.js...');
    const localEcosystem = fs.readFileSync(path.join(process.cwd(), 'ecosystem.config.js'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/ecosystem.config.js\n${localEcosystem}\nEOF`);

    console.log('🛑 Stopping and deleting old PM2 configurations to clear cached environments...');
    await ssh.execCommand('pm2 stop all || true');
    await ssh.execCommand('pm2 delete all || true');

    console.log('🚀 Loading ecosystem with loaded environment parameters...');
    const result = await ssh.execCommand('pm2 start /root/esc/ecosystem.config.js');
    console.log(result.stdout || result.stderr || 'PM2 started.');

    console.log('💾 Saving PM2 process configurations...');
    await ssh.execCommand('pm2 save');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
