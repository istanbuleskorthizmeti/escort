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

    const domainsList = rawDomains.map(d => {
      const item = {
        host: d.host,
        role: d.role,
        serverGroup: d.serverGroup
      };
      if (d.targetCity) item.targetCity = d.targetCity;
      if (d.targetDistrict) item.targetDistrict = d.targetDistrict;
      return item;
    });

    console.log('🔐 [CONNECTING] Connecting to server to update sitemap script...');
    await ssh.connect(config);

    const readRes = await ssh.execCommand('cat /var/www/escortvip/scripts/generate_dynamic_sitemap.js');
    if (readRes.code !== 0) {
      throw new Error(`Failed to read sitemap script: ${readRes.stderr}`);
    }

    const currentScript = readRes.stdout;

    const splitToken = 'const DOMAINS = [';
    if (!currentScript.includes(splitToken)) {
      throw new Error('Could not find split token "const DOMAINS = [" in sitemap script on server');
    }

    const parts = currentScript.split(splitToken);
    const prefix = parts[0];
    const rest = parts[1];

    const suffixToken = '];';
    if (!rest.includes(suffixToken)) {
      throw new Error('Could not find suffix token "];" in rest of sitemap script');
    }

    const restParts = rest.split(suffixToken);
    const suffix = restParts.slice(1).join(suffixToken);

    const domainsString = `const DOMAINS = ${JSON.stringify(domainsList, null, 2)};`;
    const updatedScript = prefix + domainsString + suffix;

    // Write back to the server
    const tempFile = path.join(process.cwd(), 'scratch', 'temp_sitemap_script.js');
    fs.writeFileSync(tempFile, updatedScript);
    await ssh.putFile(tempFile, '/var/www/escortvip/scripts/generate_dynamic_sitemap.js');
    fs.unlinkSync(tempFile);

    console.log('✅ [SUCCESS] generate_dynamic_sitemap.js script updated successfully using split method.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 Failed:', e);
    ssh.dispose();
  }
}

run();
