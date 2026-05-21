import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const GCP_IP = '34.185.231.84';
const GCP_KEY_PATH = path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine');

async function run() {
  const sshGCP = new NodeSSH();
  try {
    console.log(`📡 Connecting to GCP Server to install Nginx (${GCP_IP})...`);
    await sshGCP.connect({
      host: GCP_IP,
      username: 'onurk',
      privateKey: fs.readFileSync(GCP_KEY_PATH, 'utf8')
    });
    console.log('✅ Connected.');

    console.log('📦 Installing Nginx package via apt...');
    await sshGCP.execCommand('sudo apt-get update && sudo apt-get install -y nginx');
    console.log('✅ Nginx installed.');

    console.log('⚙️ Writing Nginx Premium reverse proxy config...');
    const nginxConfig = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Premium Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Mitigate timeouts
        proxy_read_timeout 600;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
    }
}
`;
    await sshGCP.execCommand('cat << \'EOF\' > /tmp/nginx_gcp\n' + nginxConfig + '\nEOF');
    await sshGCP.execCommand('sudo mv /tmp/nginx_gcp /etc/nginx/sites-available/default');

    console.log('🔄 Restarting and enabling Nginx service...');
    await sshGCP.execCommand('sudo systemctl enable nginx');
    const restartRes = await sshGCP.execCommand('sudo systemctl restart nginx');
    console.log('Nginx Restart Output:', restartRes.code === 0 ? 'SUCCESS' : 'FAILED', restartRes.stderr);

    console.log('🔍 Testing port 80 external response locally on GCP...');
    const curl80 = await sshGCP.execCommand('curl -I http://127.0.0.1/sitemap.xml');
    console.log('Response from Port 80:\n', curl80.stdout);

    sshGCP.dispose();
  } catch (err: any) {
    console.error('❌ Nginx installation failed:', err.message);
    sshGCP.dispose();
  }
}

run();
