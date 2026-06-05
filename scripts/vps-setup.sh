#!/bin/bash

# ==============================================================================
# 🔱 DRKCNAY HYDRA: AUTOMATED VPS DEPLOYMENT & MIGRATION SCRIPT
# Target OS: Ubuntu 20.04 / 22.04 LTS (Root Execution Required)
# ==============================================================================

# Exit immediately if any command fails
set -e

# Visual formatting helper
info() {
  echo -e "\e[34m[INFO]\e[0m $1"
}

success() {
  echo -e "\e[32m[SUCCESS]\e[0m $1"
}

error() {
  echo -e "\e[31m[ERROR]\e[0m $1"
}

# 1. ROOT CHECK
if [ "$EUID" -ne 0 ]; then
  error "Please run this script as root (sudo bash vps-setup.sh)."
  exit 1
fi

info "Starting automated VPS deployment sequence..."

# 2. UPDATE SYSTEM PACKAGES
info "Updating system package repositories..."
apt-get update -y && apt-get upgrade -y

# 3. INSTALL BASE UTILITIES
info "Installing core system utilities (curl, git, ufw, build-essential)..."
apt-get install -y curl git build-essential ufw software-properties-common fail2ban

# 4. INSTALL NODE.JS (LTS v20)
info "Installing Node.js LTS (v20)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify installations
NODE_VER=$(node -v)
NPM_VER=$(npm -v)
success "Node.js installed: $NODE_VER, NPM installed: $NPM_VER"

# 5. INSTALL PM2 GLOBALLY
info "Installing PM2 Process Manager globally..."
npm install -g pm2 tsx

# 6. INSTALL & CONFIG NGINX
info "Installing Nginx Web Server..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# Create reverse proxy configuration for Next.js app on port 3000
info "Configuring Nginx Reverse Proxy..."
cat << 'EOF' > /etc/nginx/sites-available/hydra-site
server {
    listen 80;
    server_name _; # Configured to accept all domain calls (Dynamic Multi-Tenant role)

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable configuration and disable default site
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

if [ ! -f /etc/nginx/sites-enabled/hydra-site ]; then
  ln -s /etc/nginx/sites-available/hydra-site /etc/nginx/sites-enabled/
fi

nginx -t
systemctl restart nginx
success "Nginx proxy configuration deployed and restarted successfully."

# 7. INSTALL POSTGRESQL (OPTIONAL LOCAL DB SETUP)
read -p "Do you want to install and configure a local PostgreSQL server on this VPS? (y/n): " INSTALL_PG
if [ "$INSTALL_PG" = "y" ] || [ "$INSTALL_PG" = "Y" ]; then
  info "Installing PostgreSQL Server..."
  apt-get install -y postgresql postgresql-contrib
  systemctl enable postgresql
  systemctl start postgresql
  
  # Configure PG database and user
  info "Creating database user and schema..."
  sudo -u postgres psql -c "CREATE USER hydra_user WITH PASSWORD 'HydraSecret2026!';"
  sudo -u postgres psql -c "CREATE DATABASE vuc2026 OWNER hydra_user;"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vuc2026 TO hydra_user;"
  
  success "Local PostgreSQL database 'vuc2026' created. User: hydra_user"
  echo -e "👉 Add this connection URL to your .env: \e[33mDATABASE_URL=\"postgresql://hydra_user:HydraSecret2026\!@127.0.0.1:5432/vuc2026?schema=public\"\e[0m"
fi

# 8. FIREWALL (UFW) SECURITY HARDENING
info "Configuring UFW Firewall (Opening 22, 80, 443, 2222)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH standard'
ufw allow 2222/tcp comment 'SSH customized'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Enable UFW (non-interactive mode)
ufw --force enable
ufw status verbose

# 9. FINALIZE & INSTRUCTIONS
success "VPS installation sequence completed successfully!"
echo -e "\n=========================================================================="
echo -e "🚀 NEXT DEPLOYMENT STEPS FOR YOUR CODEBASE:"
echo -e "1. Transfer your codebase to this VPS (e.g., to /var/www/hydra-app)."
echo -e "2. Create the \e[32m.env\e[0m file inside the project root."
echo -e "3. Run: \e[33mnpm install\e[0m"
echo -e "4. Run: \e[33mnpx prisma db push\e[0m to sync database tables."
echo -e "5. Start the Next.js process via PM2:"
echo -e "   \e[33mpm2 start npm --name \"hydra-app\" -- run start\e[0m"
echo -e "6. Save PM2 processes to boot on server restarts:"
echo -e "   \e[33mpm2 save && pm2 startup\e[0m"
echo -e "==========================================================================\n"
