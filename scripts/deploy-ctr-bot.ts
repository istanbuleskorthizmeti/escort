import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployCtrBot() {
  try {
    console.log('🚀 [DEPLOY CTR BOT] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Ensure remote directory exists
    await ssh.execCommand('mkdir -p /root/esc/dist/scripts/puppeteer', { cwd: '/root/esc' });

    // 1. Upload compiled ctr-bot.js
    console.log('📤 [UPLOAD] Uploading compiled ctr-bot.js to production VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'dist', 'scripts', 'puppeteer', 'ctr-bot.js'),
      '/root/esc/dist/scripts/puppeteer/ctr-bot.js'
    );
    console.log('✅ Upload complete.');

    // 2. Start the process under PM2
    console.log('⚔️ [PM2] Initiating Turan CTR Manipulation Bot on server...');
    await ssh.execCommand('pm2 delete ctr-manipulator', { cwd: '/root/esc' });
    const pm2Res = await ssh.execCommand('pm2 start dist/scripts/puppeteer/ctr-bot.js --name "ctr-manipulator"', { cwd: '/root/esc' });
    console.log('\n--- PM2 INITIALIZATION OUTPUT ---');
    console.log(pm2Res.stdout || 'No output.');
    console.log(pm2Res.stderr || 'No errors.');

    ssh.dispose();
    console.log('🏁 [COMPLETED] Turan CTR Manipulation Bot (Sahte Ordu) is now live and running in the background on the production VPS!');
  } catch (err: any) {
    console.error('💥 Error during CTR bot deploy:', err.message);
    ssh.dispose();
  }
}

deployCtrBot();
