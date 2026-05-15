import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkNextDir() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📂 Checking .next directory on Escort Server...');
    
    const ls = await ssh.execCommand('ls -la /root/hydra/.next');
    console.log(ls.stdout || '.next directory NOT FOUND');
    
    const buildId = await ssh.execCommand('cat /root/hydra/.next/BUILD_ID').catch(() => ({stdout: 'NO BUILD_ID'}));
    console.log('BUILD_ID:', buildId.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkNextDir();
