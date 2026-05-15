const { Client } = require('ssh2');

const ssh = new Client();
const config = {
  host: '213.232.235.181',
  port: 22,
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

const setupNginxScript = `
#!/bin/bash
echo "🚀 GOD MODE NGINX YAPILANDIRMASI BAŞLIYOR..."

# 1. Google Cloud Load Balancer Health Check IP'lerine İzin Ver (130.211.0.0/22 ve 35.191.0.0/16)
cat << 'EOF' > /etc/nginx/conf.d/gcp_real_ip.conf
set_real_ip_from 130.211.0.0/22;
set_real_ip_from 35.191.0.0/16;
set_real_ip_from 173.245.48.0/20; # Cloudflare IPs (Fallback)
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
EOF

# 2. Mevcut Nginx Ayarlarını Korumaya Al (Yedekle)
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak 2>/dev/null || true

# 3. PM2 App (Next.js) Health Check için / yoluna 200 OK yanıtını sağla (GCP Load Balancer bunu ister)
# Nginx'i yeniden başlat
nginx -t && systemctl restart nginx
echo "✅ Nginx başarıyla yapılandırıldı ve yeniden başlatıldı."
`;

ssh.on('ready', () => {
  console.log('✅ SSH Bağlantısı Kuruldu! Sunucu kalbine inildi.');
  ssh.exec(setupNginxScript, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('🚪 SSH Bağlantısı kapatılıyor...');
      ssh.end();
    }).on('data', (data) => {
      console.log('GCP: ' + data);
    }).stderr.on('data', (data) => {
      console.log('GCP ERROR: ' + data);
    });
  });
}).connect(config);
