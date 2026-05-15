import { NodeSSH } from 'node-ssh';
import { DOMAIN_MATRIX } from '../config/domains';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function orchestrateNginx() {
  try {
    await ssh.connect(config);
    console.log('🌐 [NGINX] Connected to server.');

    let masterConfig = `
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;

    for (const domain of DOMAIN_MATRIX) {
      masterConfig += `
server {
    listen 80;
    server_name ${domain.host} www.${domain.host};

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;
    }

    masterConfig = masterConfig.replace(/\$/g, '\\$');
    const remotePath = '/etc/nginx/sites-available/hydra';
    await ssh.execCommand(`echo "${masterConfig.replace(/"/g, '\\"')}" > ${remotePath}`);
    await ssh.execCommand(`ln -sf ${remotePath} /etc/nginx/sites-enabled/`);
    await ssh.execCommand('rm /etc/nginx/sites-enabled/default || true');
    await ssh.execCommand('nginx -t && systemctl reload nginx');

    console.log('✅ [NGINX COMPLETE] 111-domain orchestration successful.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [NGINX FAILED]', e);
    ssh.dispose();
  }
}

orchestrateNginx();
