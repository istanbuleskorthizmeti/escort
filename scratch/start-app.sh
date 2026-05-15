#!/bin/bash
# 🚀 DRKCNAY ELITE: Cold Start Protocol
cd /root/hydra
pm2 delete escortvip || true
fuser -k 3005/tcp || true
PORT=3005 pm2 start "npx next start -p 3005" --name escortvip --max-memory-restart 2G
pm2 save
sleep 5
netstat -tulpn | grep 3005
