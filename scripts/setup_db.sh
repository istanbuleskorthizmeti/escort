#!/bin/bash
sudo -u postgres psql -c "CREATE USER vuc2026_user WITH PASSWORD 'vuc2026_pass';"
sudo -u postgres psql -c "CREATE DATABASE vuc2026 OWNER vuc2026_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vuc2026 TO vuc2026_user;"
