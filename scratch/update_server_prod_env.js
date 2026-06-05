const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('🔄 [ENV] Updating DATABASE_URL in .env.production on the server...');
    
    // Command to replace DATABASE_URL in .env.production with the working one
    const replaceCmd = `sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable"|' /var/www/escortvip/.env.production`;
    const replaceRes = await ssh.execCommand(replaceCmd);
    console.log('Replace result:', replaceRes.stderr || 'Success');

    console.log('🚀 [PM2] Restarting escortvip...');
    const reloadRes = await ssh.execCommand('pm2 restart escortvip');
    console.log(reloadRes.stdout || reloadRes.stderr);

    console.log('⏳ Waiting 5 seconds for application reboot...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('📄 [PM2] Checking status...');
    const statusRes = await ssh.execCommand('pm2 status escortvip');
    console.log(statusRes.stdout || statusRes.stderr);

    console.log('🧪 Testing local Next.js connection (should respond 200 OK without DB errors)...');
    const curlRes = await ssh.execCommand('curl -I -s http://localhost:3000');
    console.log(curlRes.stdout || curlRes.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
