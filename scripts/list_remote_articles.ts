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

    console.log('📂 Listing remote parasite articles folder...');
    const listRes = await ssh.execCommand('ls -lh /root/esc/supreme_parasite_articles');
    console.log('STDOUT:\n', listRes.stdout || 'Folder is empty or does not exist.');
    
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
