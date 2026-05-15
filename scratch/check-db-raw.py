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

    print("Checking PageContent count via psql...")
    cmd = "PGPASSWORD='SovereignGodMode2026!' psql -U Sovereign -h 127.0.0.1 -d escortvip_db -c \"SELECT count(*) FROM \\\"PageContent\\\";\""
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

    client.close()
except Exception as e:
    print(f"Hata: {e}")
