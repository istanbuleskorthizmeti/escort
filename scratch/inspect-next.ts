import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function inspectNext() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 [ESCORT] Inspecting .next structure...');
    const res = await ssh.execCommand('ls -R /root/hydra/.next | grep ":"');
    console.log(res.stdout);
    
    console.log('\n--- Checking build.log status ---');
    const log = await ssh.execCommand('tail -n 10 /root/hydra/build.log');
    console.log(log.stdout);
    
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

inspectNext();
