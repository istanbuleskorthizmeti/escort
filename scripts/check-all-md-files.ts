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
  const docsDir = "c:\\Users\\onurk\\esc\\temp-clone-escort\\docs";
  const files = walkDirs(docsDir);
  console.log(`Found ${files.length} markdown files in clone.`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(docsDir, file);
    if (content.includes('style=') || content.includes('<br>') || (content.includes('<img') && !content.includes('/>'))) {
      console.log(`❌ Offending file: ${relPath}`);
      if (content.includes('style=')) console.log("   - Has style attributes");
      if (content.includes('<br>')) console.log("   - Has unclosed br tags");
      if (content.includes('<img') && !content.includes('/>')) console.log("   - Has unclosed img tags");
    }
  }
  console.log("Check complete.");
}

run();
