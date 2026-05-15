import paramiko
import sys

host = "45.93.137.164"
port = 22
username = "root"
password = "4TVuj7qiHMfh7CxH6K!"

try:
    print(f"Connecting to {host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, port, username, password)

    print("Listing files in /var/www/escortvip/scripts...")
    stdin, stdout, stderr = client.exec_command("ls /var/www/escortvip/scripts")
    print(stdout.read().decode())

    client.close()
except Exception as e:
    print(f"Hata: {e}")
