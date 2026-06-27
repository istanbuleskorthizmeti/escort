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

function fixFrontmatterInFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Let's check if the file starts with frontmatter or a broken frontmatter
  // Match starting marker, which could be '---' or '---title:' or similar
  if (!content.startsWith('---')) {
    // Check if it has '---' somewhere near the start
    const markerIndex = content.indexOf('---');
    if (markerIndex !== -1 && markerIndex < 100) {
      content = content.substring(markerIndex);
    } else {
      return false; // No frontmatter found
    }
  }

  // Find the end of the frontmatter. It could end with '---' or '---' combined with category
  // Let's find the closing boundary.
  // We skip the first 3 characters ('---') and look for the next '---'
  let closingIndex = content.indexOf('---', 3);
  
  if (closingIndex === -1) {
    // If no closing boundary, maybe it got merged like: 'category:\n  uri: ...---'
    const categoryMergeIndex = content.indexOf('---', content.indexOf('category:'));
    if (categoryMergeIndex !== -1) {
      closingIndex = categoryMergeIndex;
    } else {
      console.warn(`⚠️ Could not find closing frontmatter boundary in: ${filePath}`);
      return false;
    }
  }

  let frontmatterText = content.substring(3, closingIndex).trim();
  let bodyText = content.substring(closingIndex + 3);

  // If bodyText doesn't start with a newline, add one
  if (!bodyText.startsWith('\n')) {
    bodyText = '\n' + bodyText;
  }

  // Clean frontmatter lines
  const lines = frontmatterText.split('\n');
  const cleanLines: string[] = [];
  
  for (const line of lines) {
    let trimmed = line.trim();
    
    // If the line starts with a broken marker like '---title:' (due to joining error)
    if (trimmed.startsWith('---')) {
      trimmed = trimmed.replace(/^---+/, '');
    }
    
    // If the category uri has '---' appended to it, clean it
    if (trimmed.startsWith('uri:')) {
      trimmed = trimmed.replace(/---+$/, '');
    }
    
    if (trimmed !== '') {
      // Re-add line with correct indentation if it was indented
      const leadingSpaces = line.match(/^\s*/)?.[0] || '';
      cleanLines.push(leadingSpaces + trimmed);
    }
  }

  const cleanFrontmatter = cleanLines.join('\n');
  const newContent = `---\n${cleanFrontmatter}\n---${bodyText}`;

  if (newContent !== originalContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  }

  return false;
}

function processFolder(cloneDir: string) {
  const docsDir = path.join(cloneDir, 'docs');
  console.log(`🔍 Processing frontmatters in: ${docsDir}`);
  if (!fs.existsSync(docsDir)) {
    console.warn(`⚠️ docs directory not found in ${cloneDir}`);
    return;
  }

  const files = walkDirs(docsDir);
  let fixedCount = 0;

  for (const file of files) {
    if (fixFrontmatterInFile(file)) {
      fixedCount++;
    }
  }

  console.log(`✅ Fixed frontmatter issues in ${fixedCount} files inside ${cloneDir}`);
}

async function run() {
  const clone1 = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
  const clone2 = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0';

  processFolder(clone1);
  processFolder(clone2);
}

run().catch(console.error);
