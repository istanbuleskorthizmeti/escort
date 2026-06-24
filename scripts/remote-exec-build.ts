import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('🏗️ Running build on VPS...');
    const result = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=2048" npm run build', { cwd: '/var/www/escortvip' });
    console.log('Exit Code:', result.code);
    console.log('STDOUT:\n', result.stdout);
    console.log('STDERR:\n', result.stderr);

    if (result.code === 0) {
      console.log('🔄 Restarting pm2 escortvip...');
      const pm2Res = await ssh.execCommand('pm2 restart escortvip');
      console.log(pm2Res.stdout || pm2Res.stderr);
      console.log('✅ PM2 cluster restarted.');
      
      console.log('🧹 Purging Nginx cache...');
      await ssh.execCommand('rm -rf /var/cache/nginx/* && systemctl reload nginx');
      console.log('✅ Nginx cache purged.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
