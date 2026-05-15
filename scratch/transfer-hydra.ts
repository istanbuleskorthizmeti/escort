import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function transfer() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📥 Wgetting from Dizi server...');
    const res = await ssh.execCommand('wget http://45.93.137.164:8080/hydra_transfer.tar.gz -O /root/hydra_transfer.tar.gz');
    console.log(res.stdout || res.stderr);
    
    console.log('📦 Extracting...');
    // We need to strip the /root/dizicehennemi parts if tar included absolute paths
    await ssh.execCommand('mkdir -p /root/hydra_new && tar -xzf /root/hydra_transfer.tar.gz -C /root/hydra_new --strip-components=2');
    
    console.log('✅ Extraction complete!');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

transfer();
