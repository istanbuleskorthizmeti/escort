import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🚀 [RECON] Connecting to VPS...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('\n🔍 [LISTING /var/log/nginx/]');
    const listRes = await ssh.execCommand('ls -la /var/log/nginx/');
    console.log(listRes.stdout || listRes.stderr);

    console.log('\n🔍 [SEARCHING FOR access_log IN NGINX CONFIGS]');
    const findAccessLog = await ssh.execCommand('grep -rn "access_log" /etc/nginx/');
    console.log(findAccessLog.stdout || findAccessLog.stderr);

    console.log('\n🔍 [SCANNING NGINX ERROR.LOG FOR "failed" or "No such file"]');
    const errSearch = await ssh.execCommand('grep -E "failed|No such file" /var/log/nginx/error.log | tail -n 100');
    console.log(errSearch.stdout || errSearch.stderr || 'NO FILE FAILED LOGS FOUND');

    ssh.dispose();
    console.log('🏁 [FINISHED]');
  } catch (err: any) {
    console.error('💥 Recon failed:', err.message);
    ssh.dispose();
  }
}

run();
