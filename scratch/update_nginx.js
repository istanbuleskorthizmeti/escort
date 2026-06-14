
const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

const config = `
# 🌀 DRKCNAY HYDRA: HIGH-TIMEOUT NGINX CONFIG (GOD MODE)
upstream drkcnay_nextjs {
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
    keepalive 64;
}

server {
    listen 80;
    listen 443 ssl http2 default_server;
    
    server_name .dorukcanay.digital .istanbulescort.blog .vipescorthizmeti.shop .sisliescort.shop .kadikoyescort.shop .besiktasescorthizmeti.shop .esenyurtescorthizmeti.shop .beylikduzuescortlistesi.shop .avrupayakasiescort.shop .istanbulescorthizmeti.shop .pendikescorthizmeti.shop .bucaescorthizmeti.shop .izmitescorthizmeti.shop .sariyerdrkcnay.shop .leventdrkcnay.shop .istanbuldrkcnay.shop .istanbulescortkaporasiz.shop;

    ssl_certificate /etc/ssl/certs/drkcnay-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/drkcnay-selfsigned.key;

    # 🚀 AGGRESSIVE GZIP
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 🚀 Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-DRKCNAY-Node "Hydra-Alpha" always;

    # 🚀 504 GATEWAY TIMEOUT MITIGATION
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;

    location ^~ /_media/vitrin/ {
        alias /var/www/cdn/vitrin/;
        expires 365d;
        add_header Cache-Control "public, no-transform, immutable";
    }

    location ~* /.*-kaporasiz-escort-bayan-[0-9]+\.webp$ {
        root /var/www/cdn/vitrin;
        rewrite ^/.*-kaporasiz-escort-bayan-([0-9]+)\.webp$ /en-iyi-escort-profilleri-$1.webp break;
        try_files $uri =404;
        expires 365d;
        add_header Cache-Control "public, no-transform, immutable";
    }

    location ^~ /assets/img/ {
        alias /var/www/cdn/vitrin/;
        expires 365d;
        add_header Cache-Control "public, no-transform, immutable";
    }

    location /_next/static/ {
        alias /root/esc/.next/static/;
        expires 365d;
        add_header Cache-Control "public, no-transform, immutable";
    }

    location /_next/ {
        proxy_pass http://drkcnay_nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://drkcnay_nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;

async function run() {
  try {
    await ssh.connect({host:'213.232.235.181', username:'root', password:'4TVuj7qiHMfh7CxH6K!'});
    await ssh.execCommand(`cat << 'EOF' > /tmp/escortvip_new\n${config}\nEOF`);
    await ssh.execCommand('cp /tmp/escortvip_new /etc/nginx/sites-enabled/escortvip');
    const test = await ssh.execCommand('nginx -t');
    console.log(test.stdout || test.stderr);
    if (test.code === 0) {
      await ssh.execCommand('systemctl reload nginx');
      console.log("✅ Nginx Timeouts updated to 300s!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}

run();
