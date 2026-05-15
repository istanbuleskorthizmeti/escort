const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  const res = await ssh.execCommand('curl -s http://localhost:3001');
  const html = res.stdout;
  console.log('HTML Length:', html.length);
  const links = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g);
  console.log('STYLESHEET LINKS:', links);
  
  if (!links) {
    console.log('HEAD Content:', html.substring(0, 1000));
  }
  process.exit(0);
}
run();
