import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    // 1. Show pm2 process details
    const pm2Show = await ssh.execCommand('pm2 show esc-live');
    console.log('--- PM2 SHOW ESC-LIVE ---');
    console.log(pm2Show.stdout || pm2Show.stderr);

    // 2. Check ecosystem.config.js in the root of app
    const ecoConfig = await ssh.execCommand('cat /var/www/escortvip/ecosystem.config.js');
    console.log('--- ECOSYSTEM CONFIG ---');
    console.log(ecoConfig.stdout || ecoConfig.stderr);

    // 3. Check what directory PM2 is running from
    const pm2List = await ssh.execCommand('pm2 jlist');
    try {
      const parsed = JSON.parse(pm2List.stdout);
      console.log('--- PM2 PROCESS ENVIRONMENT ---');
      console.log('cwd:', parsed[0]?.pm2_env?.pm_cwd);
      console.log('exec_mode:', parsed[0]?.pm2_env?.exec_mode);
      console.log('script:', parsed[0]?.pm2_env?.pm_exec_path);
    } catch (e) {
      console.log('Could not parse pm2 jlist JSON');
    }

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
