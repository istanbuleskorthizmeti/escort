#!/bin/bash
# 🏴‍☠️ HYDRA OPSEC: GHOST NODE PROTOCOL
echo "Wiping SSH and Bash history..."
cat /dev/null > ~/.bash_history
history -c

echo "Wiping System Logs..."
cat /dev/null > /var/log/auth.log
cat /dev/null > /var/log/syslog
cat /dev/null > /var/log/messages
cat /dev/null > /var/log/wtmp
cat /dev/null > /var/log/btmp
cat /dev/null > /var/log/lastlog

echo "Wiping Web Server Logs..."
cat /dev/null > /var/log/nginx/access.log
cat /dev/null > /var/log/nginx/error.log

echo "Wiping PM2 Logs..."
pm2 flush

echo "Clearing temporary files..."
rm -rf /tmp/*

echo "✅ OPSEC GHOST WIPE COMPLETE. You were never here."
