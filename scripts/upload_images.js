const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  console.log('Connecting...');
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  
  const files = [
    'istanbul-kaporasiz-escort-melissa-1.jpg',
    'istanbul-kaporasiz-escort-melissa-2.jpg',
    'istanbul-kaporasiz-escort-melissa-3.jpg',
    'istanbul-kaporasiz-escort-melissa-4.jpg'
  ];

  for (const f of files) {
    const local = path.join(process.cwd(), 'public', 'vitrin', f);
    const remote = `/root/esc/public/vitrin/${f}`;
    const remoteCDN = `/var/www/cdn/vitrin/${f}`;
    console.log(`Uploading ${f}...`);
    
    // Read local file and encode to base64
    const b64 = fs.readFileSync(local).toString('base64');
    
    // Write an empty file first
    await ssh.execCommand(`> ${remoteCDN}`);
    
    // Chunk size (64KB chunks to prevent argument list too long)
    const chunkSize = 64000;
    for (let i = 0; i < b64.length; i += chunkSize) {
      const chunk = b64.substring(i, i + chunkSize);
      await ssh.execCommand(`echo -n "${chunk}" >> ${remoteCDN}.b64`);
    }
    
    // Decode base64 to image
    await ssh.execCommand(`base64 --decode ${remoteCDN}.b64 > ${remoteCDN}`);
    await ssh.execCommand(`rm ${remoteCDN}.b64`);
    
    // Also copy to Next.js public folder just in case
    await ssh.execCommand(`cp ${remoteCDN} ${remote}`);
    
    console.log(`Uploaded ${f} to CDN and Public.`);
  }

  console.log('Images uploaded successfully!');
  ssh.dispose();
}

run().catch(console.error);
