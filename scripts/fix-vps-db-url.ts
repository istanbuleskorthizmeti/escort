import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to 187.77.111.203.');

    console.log('🔄 Modifying local .env inside /root/esc/...');
    const result = await ssh.execCommand(
      `sed -i 's/213.232.235.181/127.0.0.1/g' /root/esc/.env`
    );
    console.log(result.stdout || result.stderr || '✅ sed command completed.');

    console.log('🔄 Checking modified .env variables...');
    const catRes = await ssh.execCommand('grep -E "DATABASE_URL|WORKSPACE" /root/esc/.env');
    console.log(catRes.stdout || catRes.stderr);

    console.log('🔄 Reloading PM2 applications to apply localhost DATABASE_URL...');
    await ssh.execCommand('pm2 reload all', { cwd: '/root/esc' });
    console.log('✅ PM2 reloaded.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
