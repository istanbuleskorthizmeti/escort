const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(process.cwd(), 'lib/vitrin-images.ts'), 'utf8');
// Simple regex to extract src values
const srcMatches = content.match(/"src":\s*"([^"]+)"/g);

if (!srcMatches) {
  console.log('No src matches found.');
  process.exit(0);
}

const srcs = srcMatches.map(m => m.match(/"src":\s*"([^"]+)"/)[1]);
const counts = {};
srcs.forEach(src => {
  counts[src] = (counts[src] || 0) + 1;
});

const duplicates = Object.entries(counts).filter(([src, count]) => count > 1);

if (duplicates.length === 0) {
  console.log('No duplicates found in lib/vitrin-images.ts');
} else {
  console.log(`Found ${duplicates.length} duplicate src values:`);
  duplicates.forEach(([src, count]) => {
    console.log(`${src}: ${count} times`);
  });
}
