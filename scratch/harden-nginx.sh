#!/bin/bash
# Nginx 502/504 Prevention Script
CONF_FILES="/etc/nginx/sites-enabled/*"
for f in $CONF_FILES
do
    if ! grep -q "proxy_read_timeout" "$f"; then
        sed -i '/proxy_pass/a \        proxy_read_timeout 300s;\n        proxy_connect_timeout 300s;\n        proxy_send_timeout 300s;' "$f"
    fi
done
nginx -t && nginx -s reload
echo "✅ Nginx timeouts hardened to 300s."
