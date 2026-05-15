const fs = require('fs');
const path = require('path');

const DIRS = [
  path.join(__dirname, 'components'),
  path.join(__dirname, 'app'),
  path.join(__dirname, 'lib')
];

const REPLACEMENTS = [
  { search: /VIP İlanlar/g, replace: 'VIP Escort İlanları' },
  { search: /vip ilanlar/g, replace: 'vip escort ilanları' },
  { search: /vip ilanlarımız/g, replace: 'vip escort ilanlarımız' },
  { search: /VIP ilanlarımız/g, replace: 'VIP escort ilanlarımız' },
  
  // SEO injections
  { search: /en seçkin vitrin/gi, replace: 'en seçkin escort vitrini' },
  { search: /elit partnerlerin ilanlarını/g, replace: 'elit escort partnerlerin ilanlarını' },
  { search: /bağımsız elit partnerlerin/g, replace: 'bağımsız elit escort partnerlerin' },
  { search: /partner seçenekleri/g, replace: 'escort partner seçenekleri' },
  
  // Protokol -> Standart / Gizlilik / VIP
  { search: /Protokol Tasarlayıcı/g, replace: 'Escort Deneyimi' },
  { search: /protokolleri/gi, replace: 'standartları' },
  { search: /Protokolü/g, replace: 'Standartları' },
  { search: /protokolü/g, replace: 'standartları' },
  { search: /Protokol/g, replace: 'Standart' },
  { search: /protokol/g, replace: 'standart' },
  
  // God Mode obfuscation
  { search: /God Mode/g, replace: 'VIP Elite' },
  { search: /God Mode/gi, replace: 'VIP Elite' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const r of REPLACEMENTS) {
        content = content.replace(r.search, r.replace);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

DIRS.forEach(processDir);
console.log('Done!');
