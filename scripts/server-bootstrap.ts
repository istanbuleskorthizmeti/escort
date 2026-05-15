import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function bootstrap() {
  try {
    await ssh.connect(config);
    console.log('🚀 [BOOTSTRAP] Connected to server.');

    const commands = [
      'export DEBIAN_FRONTEND=noninteractive',
      'apt-get update',
      'apt-get install -y curl git unzip nginx postgresql postgresql-contrib certbot python3-certbot-nginx',
      'curl -fsSL https://deb.nodesource.com/setup_22.x | bash -',
      'apt-get install -y nodejs',
      'npm install -g pm2 tsx',
      'mkdir -p /root/esc',
      'sudo -u postgres psql -c "CREATE USER vuc2026_user WITH PASSWORD \'vuc2026_pass\';" || true',
      'sudo -u postgres psql -c "CREATE DATABASE vuc2026 OWNER vuc2026_user;" || true',
      'sudo -u postgres psql -c "ALTER USER vuc2026_user WITH SUPERUSER;" || true'
    ];

    for (const cmd of commands) {
      console.log(`📡 [EXEC] ${cmd}`);
      const res = await ssh.execCommand(cmd);
      if (res.stderr && !res.stderr.includes('debconf') && !res.stderr.includes('WARNING')) console.error(`⚠️ [STDERR]: ${res.stderr}`);
      console.log(`✅ [STDOUT]: ${res.stdout.substring(0, 100)}...`);
    }

    console.log('🏁 [BOOTSTRAP COMPLETE] Node.js, PM2, and Nginx are installed.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [BOOTSTRAP FAILED]', e);
    ssh.dispose();
  }
}

bootstrap();
