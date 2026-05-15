#!/bin/bash

# Find config paths
PG_VERSION=$(psql --version | grep -oE '[0-9]+\.[0-9]+' | head -1 | cut -d. -f1)
CONF_DIR="/etc/postgresql/$PG_VERSION/main"

echo "⚙️ Configuring PostgreSQL $PG_VERSION in $CONF_DIR..."

# Update postgresql.conf to listen on all interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$CONF_DIR/postgresql.conf"
sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" "$CONF_DIR/postgresql.conf"

# Update pg_hba.conf to allow MD5 password connections from anywhere
if ! grep -q "0.0.0.0/0" "$CONF_DIR/pg_hba.conf"; then
    echo "host    all             all             0.0.0.0/0               md5" >> "$CONF_DIR/pg_hba.conf"
fi

# Restart service
echo "🔄 Restarting PostgreSQL..."
systemctl restart postgresql

echo "✅ [DONE] PostgreSQL is now open for external connections."
