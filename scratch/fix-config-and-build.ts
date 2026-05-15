import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    // 1. Fix next.config.ts by removing the misplaced reactCompiler key
    console.log('🛠️ Fixing next.config.ts...');
    const configPath = '/root/hydra/next.config.ts';
    let config = (await ssh.execCommand(`cat ${configPath}`)).stdout;
    
    // Move reactCompiler: false to experimental or just remove it if not needed
    config = config.replace('reactCompiler: false,', ''); // Remove from top level
    
    // Write fixed config back
    const base64Config = Buffer.from(config).toString('base64');
    await ssh.execCommand(`echo "${base64Config}" | base64 -d > ${configPath}`);
    console.log('✅ next.config.ts fixed.');

    // 2. Run clean build
    console.log('\n🏗️ Running CLEAN BUILD on server...');
    const buildRes = await ssh.execCommand('cd /root/hydra && rm -rf .next && npm run build');
    
    console.log('--- BUILD OUTPUT ---');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error('Build Errors/Warnings:', buildRes.stderr);
    console.log('--------------------');

    if (buildRes.stdout.includes('Successfully compiled')) {
        console.log('\n🚀 RESTARTING HYDRA-WEB...');
        await ssh.execCommand('pm2 restart hydra-web');
        console.log('🏆 HYDRA-WEB IS NOW ONLINE WITH NEW BUILD.');
    } else {
        console.error('❌ Build seems to have failed. Check output above.');
    }

    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
