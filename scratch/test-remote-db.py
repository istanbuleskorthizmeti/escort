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

    print("Checking Postgres status...")
    stdin, stdout, stderr = client.exec_command("systemctl status postgresql")
    out = stdout.read().decode('utf-8', errors='ignore').replace('\u25cf', '*')
    err = stderr.read().decode('utf-8', errors='ignore').replace('\u25cf', '*')
    print(out)
    print(err)

    print("Checking if port 5432 is listening...")
    stdin, stdout, stderr = client.exec_command("netstat -tuln | grep 5432")
    out2 = stdout.read().decode('utf-8', errors='ignore')
    print(out2)

    client.close()
except Exception as e:
    print(f"Hata: {e}")
