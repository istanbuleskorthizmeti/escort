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

    print("Reading remote DATABASE_URL...")
    stdin, stdout, stderr = client.exec_command("grep DATABASE_URL /var/www/escortvip/.env")
    print(stdout.read().decode('utf-8', errors='ignore'))

    client.close()
except Exception as e:
    print(f"Hata: {e}")
