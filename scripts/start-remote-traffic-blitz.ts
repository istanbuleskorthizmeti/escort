import { NodeSSH } from 'node-ssh';

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

    console.log('🛑 Terminating any active traffic blitz engines...');
    await ssh.execCommand('pkill -f hydra-traffic-blitz.ts || true');

    console.log('🚀 Launching Hydra Traffic Blitz Engine on VPS (stealth CTR simulation for GSC queries)...');
    await ssh.execCommand('mkdir -p /root/esc/logs');
    
    // Start traffic blitz in the background with nohup, redirecting output
    await ssh.execCommand('nohup npx tsx scripts/hydra-traffic-blitz.ts > /root/esc/logs/traffic-blitz.log 2>&1 &', {
      cwd: '/root/esc'
    });

    console.log('🏆 Hydra Traffic Blitz Autopilot successfully activated.');
    console.log('📋 Monitor progress on VPS via: tail -f /root/esc/logs/traffic-blitz.log');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error launching traffic blitz:', err.message);
    ssh.dispose();
  }
}

run();
