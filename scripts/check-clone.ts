import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
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
