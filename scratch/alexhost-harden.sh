#!/bin/bash
# 🛡️ ALEXHOST SECURITY HARDENING & MALWARE PROTECTION SUITE (GOD MODE)
# Designed for WordPress/PHP TV Show & Movie Streaming Sites on Alexhost.

set -euo pipefail

echo "=============================================="
echo "🛡️ STARTING SUN-TZU DEFENSIVE HARDENING SYSTEM"
echo "=============================================="

# 1. Block PHP Execution in Upload Directories
echo "📂 Scanning and locking down upload directories..."
WEB_ROOTS=("/var/www" "/home/*/public_html")

for ROOT in "${WEB_ROOTS[@]}"; do
  # Find all wp-content/uploads and uploads directories
  find $ROOT -type d \( -name "uploads" -o -name "wp-content/uploads" -o -name "images" \) 2>/dev/null | while read -r UPLOAD_DIR; do
    echo "🔒 Hardening upload directory: $UPLOAD_DIR"
    
    # Apache / Litespeed .htaccess block
    HTACCESS_FILE="$UPLOAD_DIR/.htaccess"
    cat << 'EOF' > "$HTACCESS_FILE"
# Disable PHP execution in uploads directory
<Files *.php>
    deny from all
</Files>
<Files ~ "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$">
    ForceType text/plain
    deny from all
</Files>
EOF
    chmod 644 "$HTACCESS_FILE"
    chown root:root "$HTACCESS_FILE" || true # Restrict modification if run as root
  done
done

# Nginx directive warning
echo "💡 NOTE: If you are using NGINX, insert this rule into your server block configuration:"
echo '------------------------------------------------------------'
echo 'location ~* ^/(wp-content/uploads|uploads|images)/.*\.php$ {'
echo '    deny all;'
echo '}'
echo '------------------------------------------------------------'

# 2. Hardening PHP.INI Configuration
echo "⚙️ Locating PHP configurations..."
PHP_INIs=$(find /etc/php/ -name "php.ini" 2>/dev/null || true)

if [ -n "$PHP_INIs" ]; then
  for INI in $PHP_INIs; do
    echo "🛡️ Injecting secure disable_functions rules to: $INI"
    # Backup before modification
    cp "$INI" "${INI}.bak"
    
    # Remove existing disable_functions line if present, then append ours
    sed -i '/^disable_functions/d' "$INI"
    echo 'disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,show_source,symlink' >> "$INI"
  done
  
  # Restart PHP-FPM services if active
  echo "🔄 Restarting PHP-FPM to apply changes..."
  systemctl restart php*-fpm 2>/dev/null || true
  systemctl restart apache2 2>/dev/null || true
  systemctl restart nginx 2>/dev/null || true
else
  echo "⚠️ No php.ini found in standard paths. Please update disable_functions manually."
fi

# 3. ClamAV Weekly Antivirus Scanning Integration
echo "🦠 Configuring ClamAV scanner..."
if ! command -v clamscan &> /dev/null; then
  echo "📦 Installing ClamAV antivirus package..."
  apt-get update && apt-get install -y clamav clamav-daemon
  systemctl stop clamav-freshclam || true
  freshclam || true
  systemctl start clamav-freshclam || true
fi

# Create custom scan script
SCAN_SCRIPT="/usr/local/bin/clamav-weekly-scan.sh"
cat << 'EOF' > "$SCAN_SCRIPT"
#!/bin/bash
LOG_FILE="/var/log/clamav/weekly_scan.log"
mkdir -p /var/log/clamav
echo "=== ClamAV Scan Started: $(date) ===" >> "$LOG_FILE"
# Scan webroots and exclude system files, alert only on threats
clamscan -r --bell -i /var/www /home --exclude-dir="^/sys" --exclude-dir="^/proc" --exclude-dir="^/dev" >> "$LOG_FILE" 2>&1
echo "=== Scan Finished: $(date) ===" >> "$LOG_FILE"
EOF

chmod +x "$SCAN_SCRIPT"

# Register Weekly Cron Job
echo "⏰ Scheduling weekly cron task for ClamAV scans (Sundays at 02:00 AM)..."
CRON_JOB="0 2 * * 0 $SCAN_SCRIPT"
(crontab -l 2>/dev/null | grep -v "$SCAN_SCRIPT" ; echo "$CRON_JOB") | crontab -

echo "=============================================="
echo "✅ SUN-TZU DEFENSIVE SHIELD APPLIED SUCCESSFUL!"
echo "=============================================="
