import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function inspectWarLive() {
  try {
    await ssh.connect(config);
    console.log('📡 Connected. Fetching live PM2 logs for hydra-all-out-war...');

    const outRes = await ssh.execCommand('tail -n 30 /root/.pm2/logs/hydra-all-out-war-out.log');
    const errRes = await ssh.execCommand('tail -n 30 /root/.pm2/logs/hydra-all-out-war-error.log');
    console.log('\n🔥 --- LIVE HYDRA WAR ENGINE OUTPUT --- 🔥\n');
    console.log(outRes.stdout || 'No stdout printed yet.');
    console.log('\n🚨 --- LIVE HYDRA WAR ENGINE ERRORS --- 🚨\n');
    console.log(errRes.stdout || 'No errors reported.');

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

inspectWarLive();
