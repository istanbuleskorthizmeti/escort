import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function checkErrors() {
  try {
    await ssh.connect(config);
    console.log('--- ERROR INVESTIGATION ---');

    console.log('\n❌ [PM2 ERROR LOGS]');
    const pm2Err = await ssh.execCommand('pm2 logs drkcnay-web-cluster --err --lines 50 --nostream');
    console.log(pm2Err.stdout || pm2Err.stderr || 'NO ERROR LOGS');

    console.log('\n📁 [BUILD AUDIT]');
    const buildCheck = await ssh.execCommand('ls -la /root/esc/.next');
    console.log(buildCheck.stdout || 'BUILD FOLDER MISSING');

    console.log('\n🏗️ [RE-BUILDING FORCED]');
    // Force a fresh build on the server to be 100% sure
    await ssh.execCommand('npm run build', { cwd: '/root/esc' });

    ssh.dispose();
  } catch (e) {
    console.error(e);
  }
}

checkErrors();
