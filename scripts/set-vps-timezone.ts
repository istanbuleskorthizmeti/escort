import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    console.log('🔐 [CONNECTING] Connecting to VPS...');
    await ssh.connect(config);

    console.log('⏰ [TIMEZONE] Changing system timezone to Europe/Istanbul...');
    await ssh.execCommand('timedatectl set-timezone Europe/Istanbul');

    console.log('🔍 [VERIFY] Current VPS Time info:');
    const timeInfo = await ssh.execCommand('timedatectl');
    console.log(timeInfo.stdout);

    console.log('🔄 [PM2] Restarting PM2 to apply timezone changes to cron jobs...');
    await ssh.execCommand('pm2 update', { cwd: '/root/esc' }); // pm2 update saves PM2 state, kills daemon and starts it again with new system env/timezone!
    
    console.log('🏁 [SUCCESS] Timezone set to Istanbul successfully!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

run();
