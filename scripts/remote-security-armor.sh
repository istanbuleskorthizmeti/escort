#!/bin/bash
# 🛡️ HYDRA SECURITY ARMOR PROTOCOL
# Hardening the Frankfurt Fortress

echo "🔐 [SECURITY] Applying Hydra Security Armor..."

# 1. File Permissions - Shield the secrets
sudo chown onurk:onurk /opt/hydra/.env
sudo chmod 600 /opt/hydra/.env
echo "✅ [SECURITY] .env file is now shielded (600)."

# 2. Firewall - Close the gates
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable
echo "✅ [SECURITY] Firewall (UFW) is active. Only essential gates (22, 80, 443) are open."

# 3. Database Isolation - Lock the vault
# Ensuring Postgres only listens on localhost for maximum safety
sudo sed -i "s/listen_addresses = '*'/listen_addresses = 'localhost'/g" /etc/postgresql/16/main/postgresql.conf
sudo systemctl restart postgresql
echo "✅ [SECURITY] Database is now isolated to localhost."

echo "🏆 [SECURITY] Frankfurt Fortress is now ARMORED."
