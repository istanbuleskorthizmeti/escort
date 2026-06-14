import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function deployEcosystem() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('📤 Uploading local ecosystem.config.js to remote...');
    await ssh.putFile(
      path.resolve('ecosystem.config.js'),
      '/root/esc/ecosystem.config.js'
    );
    console.log('✅ Upload complete.');

    console.log('🚀 [PM2] Reloading and restarting configurations...');
    // Delete existing ecosystem config to let pm2 register the new port 8081 definitions properly
    await ssh.execCommand('pm2 delete drkcnay-web-cluster');
    const pm2Start = await ssh.execCommand('pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(pm2Start.stdout || pm2Start.stderr);

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('\n--- PM2 STATUS ---');
    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout);

    console.log('\n--- ACTIVE PORTS (ss -tulnp) ---');
    const ssRes = await ssh.execCommand('ss -tulnp');
    console.log(ssRes.stdout);

    console.log('\n--- TEST CURL 127.0.0.1:8081 ---');
    const curlLocal = await ssh.execCommand('curl -I http://127.0.0.1:8081');
    console.log(curlLocal.stdout || curlLocal.stderr);

    console.log('\n--- TEST CURL istanbulescort.blog VIA NGINX ---');
    const curlNginx = await ssh.execCommand('curl -I -H "Host: istanbulescort.blog" http://127.0.0.1');
    console.log(curlNginx.stdout || curlNginx.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

deployEcosystem();
