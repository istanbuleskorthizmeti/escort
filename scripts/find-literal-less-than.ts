import * as fs from 'fs';
import * as path from 'path';

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

function run() {
  const docsDir = "c:\\Users\\onurk\\esc\\temp-clone-v1.0\\docs";
  const files = walkDirs(docsDir);
  console.log(`Auditing ${files.length} files...`);

  const allowedTags = ['<br />', '<Cards>', '</Cards>', '<Card', '</Card>', '<img', '<!--'];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      let pos = line.indexOf('<');
      while (pos !== -1) {
        // Check if this '<' starts any of the allowed tags
        const substring = line.substring(pos);
        const isAllowed = allowedTags.some(tag => substring.startsWith(tag));
        
        if (!isAllowed) {
          console.log(`❌ Invalid '<' found in ${path.relative(docsDir, file)} on line ${idx + 1}:`);
          console.log(`   ${line.trim()}`);
        }
        
        pos = line.indexOf('<', pos + 1);
      }

      // Also check for literal '{' or '}' which can break JSX expression parsing in MDX
      if (line.includes('{') || line.includes('}')) {
        // Ignore frontmatter metadata (lines 1-15 usually) and code blocks
        if (idx > 12 && !line.includes('```')) {
          console.log(`❌ Curly brace found in ${path.relative(docsDir, file)} on line ${idx + 1}:`);
          console.log(`   ${line.trim()}`);
        }
      }
    });
  }
  console.log("Audit complete.");
}

run();
