import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

const jsCodePayload = `
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const keyPath = '/root/esc/google-key-lyrical.json';
const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const client = new google.auth.JWT({
  email: keyData.client_email,
  key: keyData.private_key.replace(/\\\\n/g, '\\n'),
  scopes: [
    'https://www.googleapis.com/auth/siteverification',
    'https://www.googleapis.com/auth/webmasters'
  ],
  subject: 'info@dorukcanay.digital'
});

async function run() {
  try {
    console.log('Requesting access token via impersonation...');
    await client.authorize();
    console.log('Success! Token retrieved.');

    const siteVerification = google.siteVerification({
      version: 'v1',
      auth: client
    });

    console.log('Listing verified resources...');
    const res = await siteVerification.webResource.list({});
    console.log('Items count:', res.data.items?.length || 0);
    if (res.data.items) {
      res.data.items.forEach(item => {
        console.log(\`- \${item.site.identifier} (\${item.id}): owners: \${(item.owners || []).join(', ')}\`);
      });
    }
  } catch (err) {
    console.error('Error during impersonation:', err.message);
  }
}

run();
`;

async function main() {
  try {
    await ssh.connect(config);
    const remotePath = '/root/esc/scripts/test-impersonation.js';
    await ssh.execCommand(`cat << 'EOF' > ${remotePath}\n${jsCodePayload}\nEOF`);
    const result = await ssh.execCommand('node scripts/test-impersonation.js', { cwd: '/root/esc' });
    console.log('STDOUT:');
    console.log(result.stdout || 'No stdout.');
    console.log('STDERR:');
    console.log(result.stderr || 'No stderr.');
    ssh.dispose();
  } catch (err: any) {
    console.error('Failed:', err.message);
    ssh.dispose();
  }
}

main();
