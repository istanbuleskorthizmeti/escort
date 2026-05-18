import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 Requesting /sitemap.xml on port 3001...');
    const reqResult = await ssh.execCommand('curl -i -H "Host: vipescorthizmeti.com" http://127.0.0.1:3001/sitemap.xml');
    console.log('RESPONSE STATUS/HEADERS:\n', reqResult.stdout.slice(0, 1000));
    
    console.log('📡 Reading latest PM2 cluster logs...');
    const pm2Result = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 20 --nostream');
    console.log('PM2 LOGS:\n', pm2Result.stdout || pm2Result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
