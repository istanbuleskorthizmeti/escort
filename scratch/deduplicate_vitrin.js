const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'lib/vitrin-images.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Use regex to parse the array entries
const entries = [];
const entryRegex = /\{\s*"title":\s*"([^"]+)",\s*"src":\s*"([^"]+)"\s*\}/g;
let match;

while ((match = entryRegex.exec(content)) !== null) {
  entries.push({
    title: match[1],
    src: match[2]
  });
}

console.log(`Initial entries: ${entries.length}`);

const unique = [];
const seen = new Set();

for (const entry of entries) {
  const fileName = entry.src.split('/').pop() || '';
  // Extract base name: remove seo_NNN_ prefix and the timestamp/WhatsApp part
  const baseName = fileName.replace(/^seo_\d+_/, '').split('_2026')[0].split('WhatsApp')[0].trim();
  
  if (baseName && !seen.has(baseName)) {
    seen.add(baseName);
    unique.push(entry);
  } else if (!baseName) {
    // If we can't extract a base name, fall back to full src deduplication
    if (!seen.has(entry.src)) {
      seen.add(entry.src);
      unique.push(entry);
    }
  }
}

console.log(`Unique entries: ${unique.length}`);

const newContent = `export const vitrinImages = ${JSON.stringify(unique, null, 2)};`;

fs.writeFileSync(filePath, newContent);
console.log('✅ lib/vitrin-images.ts has been deduplicated.');
