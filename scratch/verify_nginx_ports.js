const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
}).then(async () => {
  console.log('Connected.');
  
  // Netstat might need root privileges or full path
  const netstatRes = await ssh.execCommand('ss -tulpn');
  console.log('SS Listening Ports:\n', netstatRes.stdout || netstatRes.stderr);

  // Check Nginx active config server names and listening ports
  const nginxPorts = await ssh.execCommand('ps aux | grep nginx');
  console.log('Nginx processes:\n', nginxPorts.stdout);

  ssh.dispose();
}).catch(console.error);
