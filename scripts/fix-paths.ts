import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function fixPaths() {
  try {
    await ssh.connect(config);
    console.log('🛠️ [FIX] Connected to server.');

    // Find where the files are
    const findRes = await ssh.execCommand('find /root/esc -name package.json');
    console.log('📍 package.json found at:', findRes.stdout);

    if (findRes.stdout.includes('temp_deploy')) {
      console.log('🚀 Moving files from temp_deploy to root/esc...');
      await ssh.execCommand('cp -r /root/esc/temp_deploy/* /root/esc/');
      await ssh.execCommand('rm -rf /root/esc/temp_deploy');
    }

    const verify = await ssh.execCommand('ls -la /root/esc');
    console.log('✅ Directory fixed:\n', verify.stdout);

    ssh.dispose();
  } catch (e) {
    console.error('💥 [FIX FAILED]', e);
    ssh.dispose();
  }
}

fixPaths();
