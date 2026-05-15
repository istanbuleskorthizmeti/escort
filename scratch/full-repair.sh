#!/bin/bash
# 🚀 DRKCNAY ELITE: Full Infrastructure Repair
cd /root/hydra
echo "🛑 Stopping all processes..."
pm2 stop all || true
pm2 delete escortvip || true
fuser -k 3000/tcp 3005/tcp || true

echo "🧹 Cleaning stale artifacts..."
rm -rf .next

echo "🏗️ Running production build (This may take 1-2 mins)..."
npm run build

if [ -d ".next" ]; then
    echo "✅ Build successful! Cold starting on 3005..."
    PORT=3005 pm2 start "npx next start -p 3005" --name escortvip --max-memory-restart 2G
    pm2 save
    sleep 5
    echo "📡 Verification (Port 3005):"
    netstat -tulpn | grep 3005
else
    echo "❌ Build failed! Check npm run build logs above."
    exit 1
fi
