import * as fs from 'fs';
import * as path from 'path';

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
const DOCS_DIR = path.join(CLONE_DIR, 'docs');

function walkDirs(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDirs(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walkDirs(DOCS_DIR);
console.log(`Checking frontmatters in ${files.length} files...`);

let invalidCount = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('---')) {
    console.log(`❌ File ${path.relative(CLONE_DIR, file)} does not start with ---`);
    invalidCount++;
    continue;
  }
  
  // Find index of second '---'
  const secondIndex = content.indexOf('---', 3);
  if (secondIndex === -1) {
    console.log(`❌ File ${path.relative(CLONE_DIR, file)} does not have a closing ---`);
    invalidCount++;
    continue;
  }
  
  const frontmatter = content.substring(3, secondIndex);
  
  // Check if category is valid
  if (!frontmatter.includes('category:')) {
    console.log(`⚠️ File ${path.relative(CLONE_DIR, file)} is missing category tag in frontmatter`);
  }
  
  // Check if title is present
  if (!frontmatter.includes('title:')) {
    console.log(`⚠️ File ${path.relative(CLONE_DIR, file)} is missing title tag in frontmatter`);
  }
}

console.log(`Check complete. Found ${invalidCount} invalid files.`);
