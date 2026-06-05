const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
}).then(async () => {
  console.log('Connected.');
  
  // Script checks Nginx error logs during the request
  const scriptContent = `#!/bin/bash
echo "=== REQUESTING WEBP ==="
curl -k -I -H "Host: istanbulescort.blog" https://127.0.0.1/istanbul-vip-escort-ilan-12.webp
echo "=== NGINX RECENT ERROR LOGS ==="
tail -n 10 /var/log/nginx/error.log
echo "=== NGINX RECENT ACCESS LOGS ==="
tail -n 10 /var/log/nginx/access.log
`;
  
  await ssh.execCommand(`cat << 'EOF' > /tmp/test_logs.sh\n${scriptContent}\nEOF`);
  await ssh.execCommand('chmod +x /tmp/test_logs.sh');
  const runRes = await ssh.execCommand('/tmp/test_logs.sh');
  console.log('Run results:\n', runRes.stdout || runRes.stderr);

  ssh.dispose();
}).catch(console.error);
