import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🔄 [PORT RECONFIGURATOR] Shifting Next.js application port to 3001 to resolve Umami conflict...');
  console.log('--------------------------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS via SSH.');

    // 1. Modify Nginx configuration file
    console.log(' • Updating Nginx configuration to point to port 3001...');
    const sedRes = await ssh.execCommand("sed -i 's/:3000/:3001/g' /etc/nginx/sites-available/escortvip");
    console.log(sedRes.stdout || sedRes.stderr || '   ✔ Nginx config updated successfully.');

    // 2. Test & Restart Nginx
    console.log(' • Testing & restarting Nginx...');
    const nginxTest = await ssh.execCommand('nginx -t');
    console.log(nginxTest.stdout || nginxTest.stderr);
    await ssh.execCommand('systemctl restart nginx');
    console.log('   ✔ Nginx restarted.');

    // 3. Restart PM2 process on port 3001
    console.log(' • Redeploying PM2 process on port 3001...');
    await ssh.execCommand('pm2 delete esc-live || true');
    const pm2Start = await ssh.execCommand('pm2 start npm --name "esc-live" --cwd /var/www/escortvip -- run start -- -p 3001');
    console.log(pm2Start.stdout || pm2Start.stderr);
    await ssh.execCommand('pm2 save');
    console.log('   ✔ PM2 saved.');

    // 4. Verify PM2 processes
    console.log('\n--- 🟢 NEW PM2 STATUS ---');
    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout || pm2Status.stderr);

  } catch (err: any) {
    console.error('💥 Port shifting failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
