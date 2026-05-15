import { NodeSSH } from 'node-ssh';

const diziServer = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };
const escortPass = '4TVuj7qiHMfh7CxH6K!';
const escortIp = '213.232.235.181';

async function pushToEscort() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(diziServer);
    console.log('🛠️ [DIZI] Installing sshpass...');
    await ssh.execCommand('apt-get update && apt-get install -y sshpass');

    console.log('🚀 [DIZI] Pushing hydra_transfer.tar.gz to Escort...');
    // We use sshpass to pass the password to scp
    const pushCmd = `sshpass -p "${escortPass}" scp -o StrictHostKeyChecking=no /root/hydra_transfer.tar.gz root@${escortIp}:/root/hydra_transfer.tar.gz`;
    const res = await ssh.execCommand(pushCmd);
    console.log(res.stdout || res.stderr);

    console.log('✅ [DIZI] Push complete!');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

pushToEscort();
