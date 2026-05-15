#!/bin/bash
cd /root/hydra
pm2 delete escortvip || true
PORT=3005 pm2 start "npx next start -H 0.0.0.0 -p 3005" --name escortvip --max-memory-restart 2G
pm2 save
sleep 3
netstat -tulpn | grep 3005
