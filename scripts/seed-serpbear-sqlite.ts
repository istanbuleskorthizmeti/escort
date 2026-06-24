import { DOMAIN_MATRIX } from '../config/domains';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

// Correct keyword generation matching deploy-serpbear.ts
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

async function main() {
  console.log('🐻 [SERPBEAR DUAL-DEVICE SEEDER] Seeding database with Desktop and Mobile keyword tracking...');
  console.log('----------------------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    const dbPath = '/var/www/serpbear/data/database.sqlite';

    // 1. Clear existing domains and keywords
    console.log(' • Cleaning domain and keyword tables...');
    await ssh.execCommand(`sqlite3 ${dbPath} "DELETE FROM domain; DELETE FROM keyword;"`);

    const nowStr = new Date().toISOString();
    let domainId = 1;
    let keywordId = 1;

    for (const d of DOMAIN_MATRIX) {
      const keywords = getKeywordsForDomain(d);
      if (keywords.length === 0) continue;

      console.log(`   [SEED] Domain: ${d.host} | Keywords: ${keywords.length} (Desktop + Mobile)`);

      // Insert Domain into 'domain' table (keywordCount is doubled since we track desktop + mobile)
      const domainSlug = d.host.replace(/\./g, '-');
      const insertDomainSql = `INSERT INTO domain (ID, domain, slug, keywordCount, lastUpdated, added, tags, notification, notification_interval, notification_emails, search_console, scrape_strategy, scrape_pagination_limit, scrape_smart_full_fallback, subdomain_matching) VALUES (${domainId}, '${d.host}', '${domainSlug}', ${keywords.length * 2}, '${nowStr}', '${nowStr}', '[]', 1, 'daily', '', '', '', 0, 0, '');`;
      
      const domainRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertDomainSql}"`);
      if (domainRes.stderr) {
        console.error(`   ❌ Failed to insert domain ${d.host}:`, domainRes.stderr);
      }

      // Insert Keywords into 'keyword' table for BOTH desktop and mobile
      for (const kw of keywords) {
        // Desktop Insert
        const insertDesktopSql = `INSERT INTO keyword (ID, keyword, device, country, city, latlong, domain, lastUpdated, added, position, history, volume, url, tags, lastResult, sticky, updating, lastUpdateError, settings) VALUES (${keywordId}, '${kw}', 'desktop', 'TR', '', '', '${d.host}', '${nowStr}', '${nowStr}', 0, '[]', 0, '[]', '[]', '[]', 1, 0, 0, '{}');`;
        const desktopRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertDesktopSql}"`);
        if (desktopRes.stderr) {
          console.error(`   ❌ Failed to insert desktop keyword ${kw} for ${d.host}:`, desktopRes.stderr);
        }
        keywordId++;

        // Mobile Insert
        const insertMobileSql = `INSERT INTO keyword (ID, keyword, device, country, city, latlong, domain, lastUpdated, added, position, history, volume, url, tags, lastResult, sticky, updating, lastUpdateError, settings) VALUES (${keywordId}, '${kw}', 'mobile', 'TR', '', '', '${d.host}', '${nowStr}', '${nowStr}', 0, '[]', 0, '[]', '[]', '[]', 1, 0, 0, '{}');`;
        const mobileRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertMobileSql}"`);
        if (mobileRes.stderr) {
          console.error(`   ❌ Failed to insert mobile keyword ${kw} for ${d.host}:`, mobileRes.stderr);
        }
        keywordId++;
      }

      domainId++;
    }

    console.log(`\n✅ Seeding complete. Seeded ${domainId - 1} domains and ${keywordId - 1} keywords (desktop + mobile splits) into SQLite.`);

    // Restart the docker container to load SQLite changes
    console.log(' • Restarting SerpBear container to load changes...');
    await ssh.execCommand('docker restart serpbear-app');
    console.log('   ✔ Container restarted.');

  } catch (err: any) {
    console.error('Error during seeding:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
