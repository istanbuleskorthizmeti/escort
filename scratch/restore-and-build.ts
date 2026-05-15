import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    // 1. Read LOCAL next.config.ts
    console.log('📖 Reading local next.config.ts...');
    let config = fs.readFileSync('c:/Users/onurk/esc/next.config.ts', 'utf8');
    
    // Clean misplaced reactCompiler if present
    config = config.replace('reactCompiler: false,', ''); 
    
    // 2. Upload to server via Base64 to ensure integrity
    console.log('🚀 Injecting clean next.config.ts to server...');
    const base64Config = Buffer.from(config).toString('base64');
    await ssh.execCommand(`echo "${base64Config}" | base64 -d > /root/hydra/next.config.ts`);
    console.log('✅ Integrity restored.');

    // 3. Run clean build
    console.log('\n🏗️ Running CLEAN BUILD on server...');
    const buildRes = await ssh.execCommand('cd /root/hydra && rm -rf .next && npm run build');
    
    console.log('--- BUILD OUTPUT ---');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error('Build Errors/Warnings:', buildRes.stderr.substring(0, 1000));
    console.log('--------------------');

    if (buildRes.stdout.includes('Successfully compiled')) {
        console.log('\n🚀 RESTARTING HYDRA-WEB...');
        await ssh.execCommand('pm2 restart hydra-web');
        console.log('🏆 HYDRA-WEB IS NOW ONLINE WITH NEW BUILD.');
    } else {
        console.error('❌ Build failed again. Review logs.');
    }

    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
