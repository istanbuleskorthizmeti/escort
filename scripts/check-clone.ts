import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

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
