const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
}).then(async () => {
  console.log('Connected.');
  
  const pm2Res = await ssh.execCommand('pm2 list');
  console.log('PM2 List:\n', pm2Res.stdout);
  
  const netstatRes = await ssh.execCommand('netstat -tulpn');
  console.log('Netstat Listening Ports:\n', netstatRes.stdout);

  ssh.dispose();
}).catch(console.error);
