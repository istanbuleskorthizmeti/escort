import paramiko
import sys

host = "187.77.111.203"
port = 22
username = "root"
password = "4TVuj7qiHMfh7CxH6K!"

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, port, username, password)

    cmd = "cd /var/www/escortvip && node scripts/count-db.js"
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    print("STDOUT:", out.encode('ascii', 'ignore').decode('ascii'))
    print("STDERR:", err.encode('ascii', 'ignore').decode('ascii'))

    client.close()
except Exception as e:
    print(f"Hata: {e}")
