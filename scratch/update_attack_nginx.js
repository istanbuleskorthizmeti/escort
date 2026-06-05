const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

function getDomainsFromConfig() {
  const filePath = path.join(process.cwd(), 'config', 'domains.ts');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const matrixRegex = /export const DOMAIN_MATRIX: DomainConfig\[] = (\[[\s\S]*?\]);/;
  const match = fileContent.match(matrixRegex);
  if (!match) {
    throw new Error('Could not find DOMAIN_MATRIX in config/domains.ts');
  }

  let matrix = [];
  eval(`matrix = ${match[1]}`);
  return matrix;
}

async function run() {
  try {
    const rawDomains = getDomainsFromConfig();
    console.log(`Parsed ${rawDomains.length} domains from config/domains.ts`);

    // Generate list of domains for server_name
    const domainsSet = new Set();
    for (const d of rawDomains) {
      domainsSet.add(d.host);
      // Only add www prefix for non-subdomains
      if (!d.host.includes('.') || d.host.split('.').length === 2) {
        domainsSet.add(`www.${d.host}`);
      }
    }

    const serverNamesLine = Array.from(domainsSet).join(' ');
    console.log('Generated server_name list.');

    console.log('🔐 [CONNECTING] Connecting to server to update Nginx configs...');
    await ssh.connect(config);

    const configs = ['escortvip', 'sovereign-hydra.conf'];
    for (const conf of configs) {
      console.log(`Updating /etc/nginx/sites-available/${conf}...`);
      const readRes = await ssh.execCommand(`cat /etc/nginx/sites-available/${conf}`);
      if (readRes.code !== 0) {
        console.warn(`Could not read /etc/nginx/sites-available/${conf}, skipping.`);
        continue;
      }

      let content = readRes.stdout;

      // Find the server_name line inside the server block listening on 80/443
      // We will match: server_name ... ;
      const serverNameRegex = /server_name\s+[^;]+;/;
      if (!serverNameRegex.test(content)) {
        console.error(`Could not find server_name in /etc/nginx/sites-available/${conf}`);
        continue;
      }

      content = content.replace(serverNameRegex, `server_name ${serverNamesLine};`);

      // Write updated content back to server
      const tempPath = path.join(process.cwd(), 'scratch', `temp_${conf}`);
      fs.writeFileSync(tempPath, content);
      await ssh.putFile(tempPath, `/etc/nginx/sites-available/${conf}`);
      fs.unlinkSync(tempPath);
      console.log(`Updated Nginx config: ${conf}`);
    }

    console.log('🔍 Testing Nginx configuration...');
    const testRes = await ssh.execCommand('nginx -t');
    console.log(testRes.stdout || testRes.stderr);

    if (testRes.code === 0) {
      console.log('🔄 Reloading Nginx...');
      const reloadRes = await ssh.execCommand('systemctl reload nginx');
      console.log(reloadRes.stdout || reloadRes.stderr || 'Nginx reloaded successfully.');
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
