
const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

const setupScript = `
# 🌀 DRKCNAY HYDRA: FRANKFURT MASTER SETUP
sudo apt-get update
sudo apt-get install -y curl wget git build-essential nginx

# 🚀 INSTALL NODE.JS 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 🚀 INSTALL PM2
sudo npm install -g pm2

# 🚀 CONFIGURE NGINX FOR HIGH PERFORMANCE
cat << 'EOF' > /tmp/nginx_hydra
upstream alexhost_backend {
    server 213.232.235.181:3001; # Pointing to the Alexhost Master
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    # 🚀 AGGRESSIVE CACHING & COMPRESSION
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://alexhost_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 🚀 504 MITIGATION
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
EOF

sudo mv /tmp/nginx_hydra /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Frankfurt Setup Complete as High-Performance Proxy!"
`;

async function run() {
  try {
    // Note: We use gcloud ssh locally to push keys first if needed, 
    // but here we try direct connection if keys are already in metadata.
    // Since we just created it, gcloud ssh is better to initialize.
    console.log("🚀 Initializing Frankfurt Node via gcloud...");
  } catch (err) {
    console.error(err);
  }
}

run();
