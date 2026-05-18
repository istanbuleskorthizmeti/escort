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
    
    console.log('🚀 Running production compilation on the remote droplet directly to build dist_scripts...');
    const compileRes = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-blast.ts scripts/master/telegram-master.ts', { cwd: '/root/esc' });
    console.log(compileRes.stdout || compileRes.stderr || 'Compilation finished.');

    console.log('🛑 Stopping current PM2 daemons...');
    await ssh.execCommand('pm2 stop all || true');
    await ssh.execCommand('pm2 delete all || true');

    console.log('📝 Modifying ecosystem.config.js to launch compiled JavaScript instead of TSX to bypass esbuild bugs...');
    // We will dynamically rewrite ecosystem.config.js to point to dist_scripts/
    const localEcosystem = fs.readFileSync(path.join(process.cwd(), 'ecosystem.config.js'), 'utf8')
      .replace('"tsx scripts/master/telegram-master.ts"', '"dist_scripts/scripts/master/telegram-master.js"')
      .replace('"tsx scripts/master/indexing-sniper.ts"', '"dist_scripts/scripts/master/indexing-sniper.js"')
      .replace('"tsx scripts/master/audit-engine.ts"', '"dist_scripts/scripts/master/audit-engine.js"')
      .replace('script: "npx"', 'script: "node"')
      .replace('interpreter: "none",', '');

    await ssh.execCommand(`cat << 'EOF' > /root/esc/ecosystem.config.js\n${localEcosystem}\nEOF`);

    console.log('🚀 Launching ecosystem config on droplet with compiled JS...');
    const pm2Res = await ssh.execCommand('pm2 start /root/esc/ecosystem.config.js');
    console.log(pm2Res.stdout || pm2Res.stderr || 'PM2 reloaded.');

    console.log('🚀 Triggering a test run of compiled telegram-blast.js to confirm it runs cleanly...');
    const blastRes = await ssh.execCommand('node -r dotenv/config dist_scripts/scripts/master/telegram-blast.js', { cwd: '/root/esc' });
    console.log(blastRes.stdout || blastRes.stderr || 'Blast run.');

    console.log('💾 Saving PM2 process configurations...');
    await ssh.execCommand('pm2 save');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
