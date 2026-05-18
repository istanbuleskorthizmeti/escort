import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 NGINX GLOBAL CONFIG:');
    const result = await ssh.execCommand('grep -r "proxy_cache_path" /etc/nginx/');
    console.log(result.stdout || result.stderr || 'No proxy_cache_path found');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
