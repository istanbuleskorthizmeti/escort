#!/bin/bash

# DRKCNAY ELITE - DB SETUP SCRIPT
DB_NAME="vuc2026"
DB_USER="vuc2026_user"
DB_PASS="vuc2026_pass"

echo "🚀 [GOD MODE] Database Setup starting..."

# Check if user exists
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
if [ "$USER_EXISTS" != "1" ]; then
    echo "👤 Creating user $DB_USER..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
else
    echo "✅ User $DB_USER already exists."
fi

# Check if database exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    echo "💾 Creating database $DB_NAME..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
else
    echo "✅ Database $DB_NAME already exists."
fi

# Grant permissions
echo "🔐 Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "✨ [SUCCESS] Database is ready on server!"
