import fs from 'fs';

const content = fs.readFileSync('lib/seo-metadata.ts', 'utf8');

let braceCount = 0;
let lineNum = 1;
for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') {
    lineNum++;
  }
  if (char === '{') {
    braceCount++;
    console.log(`Line ${lineNum}: { (Count: ${braceCount})`);
  } else if (char === '}') {
    braceCount--;
    console.log(`Line ${lineNum}: } (Count: ${braceCount})`);
  }
}

console.log('Final brace count:', braceCount);
