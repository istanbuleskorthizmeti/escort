import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function getGscSites() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    const scriptContent = `
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function run() {
  const keyPath = path.join(process.cwd(), 'google-key.json');
  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const sites = await searchconsole.sites.list({});
  console.log('ALL_GSC_SITES_START');
  console.log(JSON.stringify(sites.data.siteEntry || [], null, 2));
  console.log('ALL_GSC_SITES_END');
}
run().catch(console.error);
`;
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scratch/temp_list_gsc.js\n${scriptContent}\nEOF`);
    const res = await ssh.execCommand('node /root/esc/scratch/temp_list_gsc.js', { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr);
    await ssh.execCommand('rm -f /root/esc/scratch/temp_list_gsc.js');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

getGscSites();
