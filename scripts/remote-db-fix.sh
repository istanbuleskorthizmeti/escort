#!/bin/bash
# 🔑 HYDRA DATABASE SKELETON KEY
# Granting absolute authority to the database user

sudo -u postgres psql -c "ALTER USER vuc2026_user WITH SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE vuc2026 OWNER vuc2026_user;" || echo "Database might already exist."

echo "🏆 [DB-FIX] User vuc2026_user is now a SUPERUSER. Database vuc2026 is ready."
