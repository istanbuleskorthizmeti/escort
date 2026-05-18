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
    
    console.log('📡 LOG MATCHES FOR sitemap:');
    const logs1 = await ssh.execCommand('grep -i "sitemap" /root/.pm2/logs/*.log | tail -n 30');
    console.log(logs1.stdout || logs1.stderr || 'No sitemap logs found.');

    console.log('\n📡 LOG MATCHES FOR seo:');
    const logs2 = await ssh.execCommand('grep -i "seo" /root/.pm2/logs/*.log | tail -n 30');
    console.log(logs2.stdout || logs2.stderr || 'No seo logs found.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
