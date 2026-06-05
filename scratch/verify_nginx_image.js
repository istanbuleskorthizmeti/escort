const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
}).then(async () => {
  console.log('Connected.');
  
  // Use absolute paths and redirection output to make sure we capture it
  const res = await ssh.execCommand('/usr/bin/curl -k -v -H "Host: istanbulescort.blog" https://127.0.0.1/istanbul-vip-escort-ilan-12.webp 2>&1');
  console.log('Output:\n', res.stdout);

  ssh.dispose();
}).catch(console.error);
