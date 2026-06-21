import * as fs from 'fs';
import * as path from 'path';

const domainsPath = path.resolve('config/domains.ts');
let content = fs.readFileSync(domainsPath, 'utf8');

// Replace role: 'SATELLITE' with role: 'MONEY_SITE'
// Replace category: 'SATELLITE_LOCAL' with category: 'MONEY_SITE'
let updated = content
  .replace(/role:\s*'SATELLITE'/g, "role: 'MONEY_SITE'")
  .replace(/category:\s*'SATELLITE_LOCAL'/g, "category: 'MONEY_SITE'");

fs.writeFileSync(domainsPath, updated, 'utf8');
console.log('✅ Successfully updated config/domains.ts: All SATELLITE domains converted to MONEY_SITE.');
