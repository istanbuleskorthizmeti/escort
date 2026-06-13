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

    console.log('📤 Uploading updated GSC_FULL_QUERIES.json...');
    await ssh.putFile(path.join(localDir, 'GSC_FULL_QUERIES.json'), '/root/esc/GSC_FULL_QUERIES.json');

    console.log('📤 Uploading updated scripts/hydra-traffic-blitz.ts...');
    await ssh.putFile(path.join(localDir, 'scripts/hydra-traffic-blitz.ts'), '/root/esc/scripts/hydra-traffic-blitz.ts');

    console.log('📤 Uploading updated lib/seo/proxy-handler.ts...');
    await ssh.putFile(path.join(localDir, 'lib/seo/proxy-handler.ts'), '/root/esc/lib/seo/proxy-handler.ts');

    console.log('🛑 Terminating old traffic blitz process...');
    await ssh.execCommand('pkill -f hydra-traffic-blitz.ts || true');

    console.log('🚀 Restarting Hydra Traffic Blitz Engine on VPS (with multi-page SERP scanning)...');
    await ssh.execCommand('nohup npx tsx scripts/hydra-traffic-blitz.ts > /root/esc/logs/traffic-blitz.log 2>&1 &', {
      cwd: '/root/esc'
    });

    console.log('🏆 Traffic blitz engine updated and restarted in background.');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Surgical sync failed:', err.message);
    ssh.dispose();
  }
}

run();
