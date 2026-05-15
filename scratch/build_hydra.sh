#!/bin/bash
cd /var/www/esc
echo "🧹 [PURGE] Cleaning old build..."
rm -rf .next
echo "🏗️ [BUILD] Starting production build (8GB RAM)..."
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
if [ $? -eq 0 ]; then
  echo "🔥 [RESTART] Build successful! Rebooting cluster..."
  pm2 delete all || true
  pm2 start ecosystem.config.js --env production
  pm2 save
  systemctl reload nginx
  echo "🏁 [COMPLETE] System is LIVE and STYLED!"
else
  echo "❌ [ERROR] Build failed!"
  exit 1
fi
