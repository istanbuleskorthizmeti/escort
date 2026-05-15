#!/bin/bash
# 🏰 HYDRA DATABASE FORTRESS SETUP - ALIGNED
# This script configures Postgres to match the .env expectations

DB_USER="vuc2026_user"
DB_PASS="vuc2026_pass"
DB_NAME="vuc2026"

echo "🐘 [DB-SETUP] Configuring PostgreSQL for vuc2026..."

# Create User and Database if they don't exist
sudo -u postgres psql -c "DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASS';
    END IF;
END
\$\$;"

sudo -u postgres psql -c "SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec"

echo "✅ [DB-SETUP] Database $DB_NAME and User $DB_USER are ready."
sudo systemctl restart postgresql
echo "🚀 [DB-SETUP] PostgreSQL restarted."
