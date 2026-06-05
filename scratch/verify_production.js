const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
}).then(async () => {
  console.log('Connected to Next.js server.');
  
  // Curl the raw HTML of the AMP page
  const ampRes = await ssh.execCommand('curl -s -H "Host: istanbulescort.blog" http://localhost:3000/amp');
  const ampHtml = ampRes.stdout;

  console.log('=== AMP IMAGE SOURCES ===');
  const imgRegex = /<amp-img[^>]*src="([^"]*)"/gi;
  let match;
  while ((match = imgRegex.exec(ampHtml)) !== null) {
    console.log(match[1]);
  }

  ssh.dispose();
}).catch(console.error);
