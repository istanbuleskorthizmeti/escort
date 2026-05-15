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

    print("Checking Node.js version...")
    stdin, stdout, stderr = client.exec_command("node -v")
    print("Node:", stdout.read().decode().strip())

    print("Checking NPM version...")
    stdin, stdout, stderr = client.exec_command("npm -v")
    print("NPM:", stdout.read().decode().strip())

    print("Checking if /var/www/escortvip exists...")
    stdin, stdout, stderr = client.exec_command("ls -d /var/www/escortvip")
    print("Dir:", stdout.read().decode().strip())

    client.close()
except Exception as e:
    print(f"Hata: {e}")
