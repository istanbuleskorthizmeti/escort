const fs = require('fs');
const path = require('path');

function searchDir(dir, query) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        results = results.concat(searchDir(fullPath, query));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (query.test(content)) {
            results.push(fullPath);
          }
        } catch (e) {}
      }
    }
  });
  return results;
}

const queries = [
  /exec\(/,
  /execSync\(/,
  /spawn\(/,
  /eval\(/,
  /Function\(/,
  /system\(/,
  /popen\(/
];

console.log('=== Searching for potential execution points ===');
const baseDir = 'c:\\Users\\onurk\\esc';
queries.forEach(q => {
  console.log(`Query: ${q}`);
  const files = searchDir(baseDir, q);
  console.log(`Found in:`, files);
});
