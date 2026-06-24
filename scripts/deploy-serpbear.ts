import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';
import { DOMAIN_MATRIX } from '../config/domains';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

// Helper function to get keywords for a domain configuration
function getKeywordsForDomain(d: typeof DOMAIN_MATRIX[0]): string[] {
  const list: string[] = [];

  if (d.role === 'MONEY_SITE') {
    if (d.targetDistrict) {
      const distClean = d.targetDistrict.toLowerCase();
      // Turkish characters mapping for District
      const distTr = distClean
        .replace(/c/g, 'ç')
        .replace(/g/g, 'ğ')
        .replace(/i/g, 'ı')
        .replace(/o/g, 'ö')
        .replace(/s/g, 'ş')
        .replace(/u/g, 'ü');

      list.push(`${distClean} escort`);
      list.push(`${distClean} eskort`);
      if (distTr !== distClean) {
        list.push(`${distTr} escort`);
        list.push(`${distTr} eskort`);
      }
    } else if (d.targetCity) {
      list.push(`${d.targetCity} escort`);
      list.push(`${d.targetCity} eskort`);
    } else {
      list.push('istanbul escort');
      list.push('istanbul eskort');
      list.push('vip escort istanbul');
    }
    list.push('dorukcanay');
  } else if (d.category === 'CLOAKER_IFSA') {
    list.push('ifşa izle');
    list.push('türk ifşa');
    list.push('telegram ifşa');
    if (d.host.includes('onlyfans')) {
      list.push('onlyfans ifşa');
    }
  } else if (d.category === 'CLOAKER_TOOL') {
    if (d.host.includes('santajci')) {
      list.push('şantajcı tespit');
      list.push('şantajcı bulma');
    } else if (d.host.includes('plaka')) {
      list.push('plaka sorgulama');
      list.push('plaka sorgula');
    } else if (d.host.includes('casus')) {
      list.push('casus yazılım silme');
      list.push('casus yazılım sil');
    } else if (d.host.includes('sms')) {
      list.push('sanal sms');
      list.push('sanal numara alma');
    } else if (d.host.includes('borsa')) {
      list.push('borsa tüyoları');
    } else if (d.host.includes('tiktok')) {
      list.push('tiktok hilesi');
    } else if (d.host.includes('bedava')) {
      list.push('bedava hesap');
    } else if (d.host.includes('insta')) {
      list.push('instagram şifre kırma');
    } else if (d.host.includes('mac')) {
      list.push('canlı maç izle');
    } else if (d.host.includes('kesintisiz')) {
      list.push('canlı tv izle');
    } else if (d.host.includes('apk')) {
      list.push('apk oyun indir');
    } else if (d.host.includes('fragman')) {
      list.push('fragman izle');
    } else if (d.host.includes('konum')) {
      list.push('numaradan konum bulma');
    } else if (d.host.includes('dizi')) {
      list.push('dizi izle');
    } else if (d.host.includes('yardim')) {
      list.push('yardım başvurusu');
    }
  } else {
    list.push(`${d.host} seo`);
  }

  // Deduplicate and return
  return Array.from(new Set(list));
}

async function run() {
  console.log('🐻 [SERPBEAR DEPLOYER] Starting SerpBear Deployer on New VPS...');
  console.log('------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS via SSH.');

    // 1. Install Docker & SQLite3 if missing
    console.log(' • Checking & installing dependencies (Docker, Compose, SQLite3)...');
    await ssh.execCommand('apt-get update');
    await ssh.execCommand('apt-get install -y docker.io docker-compose sqlite3');

    // 2. Prepare SerpBear directory
    console.log(' • Provisioning SerpBear workspace (/var/www/serpbear)...');
    await ssh.execCommand('mkdir -p /var/www/serpbear/data');

    // 3. Write docker-compose.yml on the server
    const composeContent = `version: '3.7'
services:
  serpbear:
    image: towfiqi/serpbear:latest
    container_name: serpbear-app
    restart: unless-stopped
    ports:
      - "5000:3000"
    environment:
      - USER_NAME=admin
      - PASSWORD=onur2026
      - SECRET=vuc_serp_secret_2026
      - APIKEY=vuc_serp_apikey_2026
      - SESSION_DURATION=24
      - NEXT_PUBLIC_APP_URL=https://serp.dorukcanay.digital
    volumes:
      - /var/www/serpbear/data:/app/data
`;
    const localComposePath = path.join(process.cwd(), 'scratch', 'serpbear-compose.yml');
    fs.writeFileSync(localComposePath, composeContent);
    await ssh.putFile(localComposePath, '/var/www/serpbear/docker-compose.yml');
    fs.unlinkSync(localComposePath);

    // 4. Spin up container
    console.log(' • Spinning up SerpBear container via Docker Compose...');
    const composeUp = await ssh.execCommand('docker compose up -d || docker-compose up -d', { cwd: '/var/www/serpbear' });
    console.log(composeUp.stdout || composeUp.stderr);

    // 5. Wait for the database file to be initialized by the container
    console.log(' • Waiting for database initialization (10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    const dbPath = '/var/www/serpbear/data/database.sqlite';
    const dbCheck = await ssh.execCommand(`ls -la ${dbPath}`);
    if (dbCheck.stderr || !dbCheck.stdout.includes('database.sqlite')) {
      console.log(' ⚠️ Database file not found yet. Retrying wait for 10 more seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // 6. Inspect SQLite database schema
    console.log(' • Reading database tables schema...');
    const tablesInfo = await ssh.execCommand(`sqlite3 ${dbPath} ".tables"`);
    console.log('   Tables:', tablesInfo.stdout.trim());

    const domainSchema = await ssh.execCommand(`sqlite3 ${dbPath} "PRAGMA table_info(Domains);"`);
    console.log('   Domains Table Schema:\n', domainSchema.stdout.trim());

    const keywordSchema = await ssh.execCommand(`sqlite3 ${dbPath} "PRAGMA table_info(Keywords);"`);
    console.log('   Keywords Table Schema:\n', keywordSchema.stdout.trim());

    // 7. Seed domains and keywords using sqlite3 CLI directly
    console.log(' • Seeding domains and keywords into database...');
    
    // Clear existing to avoid duplicate seeds if re-run
    await ssh.execCommand(`sqlite3 ${dbPath} "DELETE FROM Domains; DELETE FROM Keywords;"`);

    let domainId = 1;
    let keywordId = 1;

    for (const d of DOMAIN_MATRIX) {
      const keywords = getKeywordsForDomain(d);
      const nowStr = new Date().toISOString();

      console.log(`   [SEEDING] ${d.host} with ${keywords.length} keywords...`);

      // Insert Domain
      // Fields: id, name, createdAt, updatedAt
      const insertDomainSql = `INSERT INTO Domains (id, name, createdAt, updatedAt) VALUES (${domainId}, '${d.host}', '${nowStr}', '${nowStr}');`;
      await ssh.execCommand(`sqlite3 ${dbPath} "${insertDomainSql}"`);

      // Insert Keywords
      for (const kw of keywords) {
        // Fields: id, domain, keyword, device, country, createdAt, updatedAt, DomainId
        // Devices: desktop, mobile. Default to desktop
        const insertKeywordSql = `INSERT INTO Keywords (id, domain, keyword, device, country, createdAt, updatedAt, DomainId) VALUES (${keywordId}, '${d.host}', '${kw}', 'desktop', 'tr', '${nowStr}', '${nowStr}', ${domainId});`;
        await ssh.execCommand(`sqlite3 ${dbPath} "${insertKeywordSql}"`);
        keywordId++;
      }

      domainId++;
    }

    console.log(`✅ Seeding complete. Seeded ${domainId - 1} domains and ${keywordId - 1} keywords.`);

    // 8. Configure Nginx Reverse Proxy for serp.dorukcanay.digital
    console.log(' • Configuring Nginx reverse proxy for serp.dorukcanay.digital...');
    const nginxConfig = `server {
    listen 80;
    server_name serp.dorukcanay.digital;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name serp.dorukcanay.digital;

    ssl_certificate /etc/ssl/certs/drkcnay-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/drkcnay-selfsigned.key;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;
    const localNginxPath = path.join(process.cwd(), 'scratch', 'nginx_serpbear');
    fs.writeFileSync(localNginxPath, nginxConfig);
    await ssh.putFile(localNginxPath, '/etc/nginx/sites-available/serpbear');
    fs.unlinkSync(localNginxPath);

    await ssh.execCommand('ln -sf /etc/nginx/sites-available/serpbear /etc/nginx/sites-enabled/serpbear');
    
    console.log(' • Testing & restarting Nginx...');
    const nginxTest = await ssh.execCommand('nginx -t');
    console.log(nginxTest.stdout || nginxTest.stderr);
    await ssh.execCommand('systemctl restart nginx');
    console.log('✅ Nginx configuration active.');

    console.log('\n🏆 [SUCCESS] SerpBear is deployed, configured with Nginx proxy, and fully seeded!');
    console.log('========================================================================');
    console.log('🌐 Access URL: https://serp.dorukcanay.digital');
    console.log('🔑 Credentials: Username: admin | Password: onur2026');
    console.log('========================================================================');

  } catch (err: any) {
    console.error('💥 Deployment failed with error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
