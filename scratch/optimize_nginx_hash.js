const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    // 1. Read /etc/nginx/nginx.conf
    const readConf = await ssh.execCommand('cat /etc/nginx/nginx.conf');
    if (readConf.code !== 0) {
      throw new Error(`Failed to read nginx.conf: ${readConf.stderr}`);
    }

    let nginxConf = readConf.stdout;

    // Uncomment or modify server_names_hash_bucket_size
    const regexExisting = /#?\s*server_names_hash_bucket_size\s+\d+\s*;/;
    if (regexExisting.test(nginxConf)) {
      nginxConf = nginxConf.replace(regexExisting, 'server_names_hash_bucket_size 128;');
      console.log('Found existing server_names_hash_bucket_size, updated to 128.');
    } else {
      // If not found, inject it inside the http { ... } block
      const httpBlockIdx = nginxConf.indexOf('http {');
      if (httpBlockIdx === -1) {
        throw new Error('Could not find http block in nginx.conf');
      }
      const insertIdx = httpBlockIdx + 6; // right after "http {"
      nginxConf = nginxConf.substring(0, insertIdx) + '\n\tserver_names_hash_bucket_size 128;\n' + nginxConf.substring(insertIdx);
      console.log('Injected server_names_hash_bucket_size 128 inside http block.');
    }

    // Write updated nginx.conf back to server
    // Escape double quotes and write
    const escapedConf = nginxConf.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const writeRes = await ssh.execCommand(`cat << 'EOF' > /etc/nginx/nginx.conf\n${nginxConf}\nEOF`);
    if (writeRes.code !== 0) {
      throw new Error(`Failed to write nginx.conf: ${writeRes.stderr}`);
    }
    console.log('Successfully updated /etc/nginx/nginx.conf on server.');

    // 2. Remove duplicate/conflicting site configs
    console.log('Cleaning up duplicate sites-enabled...');
    await ssh.execCommand('rm -f /etc/nginx/sites-enabled/escortvip');

    // 3. Test and reload Nginx
    console.log('🔍 Testing Nginx configuration...');
    const testRes = await ssh.execCommand('nginx -t');
    console.log(testRes.stdout || testRes.stderr);

    if (testRes.code === 0) {
      console.log('🔄 Reloading Nginx...');
      const reloadRes = await ssh.execCommand('systemctl reload nginx');
      console.log(reloadRes.stdout || reloadRes.stderr || 'Nginx reloaded successfully without conflicts!');
    } else {
      console.error('❌ Nginx configuration test failed. Reverting changes is recommended.');
    }

    ssh.dispose();
  } catch (e) {
    console.error('💥 Failed:', e);
    ssh.dispose();
  }
}

run();
