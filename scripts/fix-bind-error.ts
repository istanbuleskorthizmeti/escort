import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function fix() {
  try {
    await ssh.connect(config);
    console.log('--- ROOT CAUSE FIX ---');

    console.log('\n🔍 [CHECKING NGINX ERRORS]');
    const nginxLogs = await ssh.execCommand('tail -n 30 /var/log/nginx/error.log');
    console.log(nginxLogs.stdout || 'NO NGINX ERRORS');

    console.log('\n🔍 [CHECKING PM2 APP ERRORS]');
    const pm2Logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 50 --nostream');
    console.log(pm2Logs.stdout || pm2Logs.stderr || 'NO PM2 LOGS');

    console.log('\n🛠️ [RE-ORCHESTRATING NGINX]');
    // Simplified Nginx for diagnosis: listen on 80 and proxy to 3001
    const testConfig = `
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
`;
    await ssh.execCommand(`echo "${testConfig.replace(/"/g, '\\"')}" > /etc/nginx/sites-available/test`);
    await ssh.execCommand('ln -sf /etc/nginx/sites-available/test /etc/nginx/sites-enabled/test');
    await ssh.execCommand('rm /etc/nginx/sites-enabled/default || true');
    await ssh.execCommand('systemctl restart nginx');

    ssh.dispose();
  } catch (e) {
    console.error(e);
  }
}

fix();
