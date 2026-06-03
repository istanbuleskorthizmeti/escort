import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function updatePm2Env() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🔄 Checking the DATABASE_URL currently loaded in PM2...');
    const pm2EnvRes = await ssh.execCommand('pm2 env 5'); // 5 is one of the cluster pids
    console.log(pm2EnvRes.stdout.substring(0, 1000) || pm2EnvRes.stderr);

    console.log('🚀 Restarting PM2 with --update-env parameter...');
    const restartRes = await ssh.execCommand('pm2 restart drkcnay-web-cluster --update-env');
    console.log(restartRes.stdout || restartRes.stderr);

    console.log('⏳ Waiting 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n--- VERIFYING HOME PAGE VIA NGINX ---');
    const curlRes = await ssh.execCommand('curl -I -H "Host: dorukcanay.digital" http://127.0.0.1');
    console.log(curlRes.stdout || curlRes.stderr);

    console.log('\n--- VERIFYING DYNAMIC DISTRICT PAGE VIA NGINX ---');
    const curlDist = await ssh.execCommand('curl -I -H "Host: dorukcanay.digital" http://127.0.0.1/istanbul/esenyurt-escort-gercek-gorseller');
    console.log(curlDist.stdout || curlDist.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

updatePm2Env();
