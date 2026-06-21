import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function checkClone() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected');
    
    const res = await ssh.execCommand('git clone https://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@github.com/guondyshop-del/hydra-god-mode.git /root/esc');
    console.log('STDOUT:', res.stdout);
    console.log('STDERR:', res.stderr);

    ssh.dispose();
  } catch (e) {
    console.error('Failed', e);
  }
}

checkClone();
