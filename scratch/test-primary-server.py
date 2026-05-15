import paramiko
import sys

host = "187.77.111.203"
port = 22
username = "root"
password = "4TVuj7qiHMfh7CxH6K!"

try:
    print(f"Connecting to {host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, port, username, password)

    print("Success! Logged into 187.77.111.203")
    stdin, stdout, stderr = client.exec_command("ls -d /var/www/escortvip")
    print("Dir:", stdout.read().decode().strip())

    client.close()
except Exception as e:
    print(f"Hata: {e}")
