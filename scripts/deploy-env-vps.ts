import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🔐 Connecting to VPS...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    const localDir = process.cwd();

    console.log('📤 Uploading updated .env...');
    await ssh.putFile(path.join(localDir, '.env'), '/root/esc/.env');

    console.log('🛑 Terminating old traffic blitz process...');
    await ssh.execCommand('pkill -f hydra-traffic-blitz.ts || true');

    console.log('🚀 Restarting Hydra Traffic Blitz Engine on VPS...');
    await ssh.execCommand('nohup npx tsx scripts/hydra-traffic-blitz.ts > /root/esc/logs/traffic-blitz.log 2>&1 &', {
      cwd: '/root/esc'
    });

    console.log('🏆 VPS updated and traffic engine restarted.');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 VPS deployment failed:', err.message);
    ssh.dispose();
  }
}

run();
