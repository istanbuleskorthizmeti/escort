import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    console.log('\n--- NGINX: SITES-ENABLED ---');
    const sitesRes = await ssh.execCommand('ls /etc/nginx/sites-enabled');
    console.log(sitesRes.stdout);

    console.log('\n--- NGINX: DETAILED SEARCH FOR DOMAINS ---');
    const grepRes = await ssh.execCommand('grep -r "server_name" /etc/nginx/sites-enabled');
    console.log(grepRes.stdout);

    console.log('\n--- NGINX: PROXY_PASS CHECK ---');
    const proxyRes = await ssh.execCommand('grep -r "proxy_pass" /etc/nginx/sites-enabled');
    console.log(proxyRes.stdout);

    console.log('\n--- PM2: FULL LIST ---');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout);

    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
