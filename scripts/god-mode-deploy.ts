import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!',
  readyTimeout: 20000
};

async function executeDeployment() {
  try {
    console.log('🔐 [CONNECTING] Connecting to Alexhost Server...');
    await ssh.connect(config);
    console.log('✅ [CONNECTED] Access granted.');

    const commands = [
      'rm -rf /root/esc',
      'git clone https://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@github.com/guondyshop-del/hydra-god-mode.git /root/esc',
      'cd /root/esc && npm install',
      'cd /root/esc && npx prisma generate',
      'cd /root/esc && npx next build',
      'cd /root/esc && pm2 start ecosystem.config.js',
      'pm2 save',
      'systemctl restart nginx'
    ];

    for (const cmd of commands) {
      console.log(`📡 [EXEC] ${cmd}`);
      const res = await ssh.execCommand(cmd);
      if (res.stderr && !res.stderr.includes('Cloning into') && !res.stderr.includes('npm WARN') && !res.stderr.includes('deprecat')) {
          console.warn(`⚠️ [STDERR] ${res.stderr.substring(0, 200)}...`);
      }
      if (res.stdout) {
          console.log(`✅ [STDOUT] ${res.stdout.substring(0, 100)}...`);
      }
    }

    console.log('🏁 [GOD MODE DEPLOYMENT COMPLETE] Sites should be LIVE.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [DEPLOYMENT FAILED]', e);
    ssh.dispose();
  }
}

executeDeployment();
