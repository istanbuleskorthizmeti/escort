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
    
    console.log('📤 Uploading modified source scripts to droplet...');
    const localMaster = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'telegram-master.ts'), 'utf8');
    const localAudit = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'audit-engine.ts'), 'utf8');
    const localIndex = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'indexing-sniper.ts'), 'utf8');
    const localEcosystem = fs.readFileSync(path.join(process.cwd(), 'ecosystem.config.js'), 'utf8');

    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/telegram-master.ts\n${localMaster}\nEOF`);
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/audit-engine.ts\n${localAudit}\nEOF`);
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/indexing-sniper.ts\n${localIndex}\nEOF`);
    await ssh.execCommand(`cat << 'EOF' > /root/esc/ecosystem.config.js\n${localEcosystem}\nEOF`);

    console.log('🚀 Compiling all 3 master scripts via remote TSC build...');
    const buildRes = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-master.ts scripts/master/audit-engine.ts scripts/master/indexing-sniper.ts', { cwd: '/root/esc' });
    console.log(buildRes.stdout || buildRes.stderr || 'Build executed.');

    console.log('🛑 Stopping and deleting old PM2 configurations...');
    await ssh.execCommand('pm2 stop all || true');
    await ssh.execCommand('pm2 delete all || true');

    console.log('🚀 Loading ecosystem with compiled JavaScript bundles...');
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
