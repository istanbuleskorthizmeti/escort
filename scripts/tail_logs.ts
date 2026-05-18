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
    
    console.log('📡 FILTERED LOGS FOR SEO-ENGINE (out-0.log):');
    const logs0 = await ssh.execCommand('grep -i "SEO-ENGINE" /root/.pm2/logs/drkcnay-web-cluster-out-0.log | tail -n 25');
    console.log(logs0.stdout || logs0.stderr || 'No matching log lines in out-0.log.');

    console.log('\n📡 FILTERED LOGS FOR SEO-ENGINE (out-4.log):');
    const logs4 = await ssh.execCommand('grep -i "SEO-ENGINE" /root/.pm2/logs/drkcnay-web-cluster-out-4.log | tail -n 25');
    console.log(logs4.stdout || logs4.stderr || 'No matching log lines in out-4.log.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
