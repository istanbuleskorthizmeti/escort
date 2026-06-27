import * as fs from 'fs';
import * as path from 'path';

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
const DOCS_DIR = path.join(CLONE_DIR, 'docs');

function cleanAndWriteFrontmatter(filePath: string, targetCategoryUri: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('---')) {
    console.log(`⚠️ Skip file without frontmatter: ${filePath}`);
    return;
  }

  // Find end of frontmatter
  const firstIndex = 3;
  const secondIndex = content.indexOf('---', firstIndex);
  if (secondIndex === -1) {
    console.log(`⚠️ Invalid frontmatter in file: ${filePath}`);
    return;
  }

  const frontmatterText = content.slice(firstIndex, secondIndex);
  const remainingContent = content.slice(secondIndex + 3);

  // Split frontmatter by line
  const lines = frontmatterText.split('\n');
  const cleanLines: string[] = [];

  let inCategoryBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('category:')) {
      inCategoryBlock = true;
      continue;
    }

    if (inCategoryBlock) {
      // If the line is indented (starts with whitespace), it is part of the category block
      if (line.startsWith(' ') || line.startsWith('\t') || trimmed === '') {
        continue;
      } else {
        inCategoryBlock = false;
      }
    }

    cleanLines.push(line);
  }

  // Append new category block at the end
  cleanLines.push('category:');
  cleanLines.push(`  uri: ${targetCategoryUri}`);

  // Join back and write
  const newFrontmatter = cleanLines.join('\n');
  const newContent = `---${newFrontmatter}---${remainingContent}`;
  fs.writeFileSync(filePath, newContent, 'utf8');
}

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

async function main() {
  console.log('🏁 Starting category renaming and frontmatter synchronization...');

  // 1. Rename Folders
  const sourceBercem = path.join(DOCS_DIR, 'uri-that-does-not-map-to-bercem-engez-vip');
  const targetBercem = path.join(DOCS_DIR, 'istanbul-bercem-engez-escort-2026');

  const sourceEscort = path.join(DOCS_DIR, 'uri-that-does-not-map-to-istanbul-escorts');
  const targetEscort = path.join(DOCS_DIR, 'istanbul-escort-bayanlar');

  const emptyEscortFolder = path.join(DOCS_DIR, 'istanbul-escorts');
  const drkcnFolder = path.join(DOCS_DIR, 'istanbul-escort-hizmetleri-2026-drkcn');

  // Delete empty istanbul-escorts folder if exists
  if (fs.existsSync(emptyEscortFolder)) {
    console.log(`🧹 Deleting old empty folder: ${emptyEscortFolder}`);
    fs.rmSync(emptyEscortFolder, { recursive: true, force: true });
  }

  // Rename Bercem Engez folder
  if (fs.existsSync(sourceBercem)) {
    console.log(`📂 Renaming ${sourceBercem} -> ${targetBercem}`);
    fs.renameSync(sourceBercem, targetBercem);
  } else {
    console.log(`ℹ️ Folder already renamed or not found: ${sourceBercem}`);
  }

  // Rename Istanbul Escorts folder
  if (fs.existsSync(sourceEscort)) {
    console.log(`📂 Renaming ${sourceEscort} -> ${targetEscort}`);
    fs.renameSync(sourceEscort, targetEscort);
  } else {
    console.log(`ℹ️ Folder already renamed or not found: ${sourceEscort}`);
  }

  // 2. Update docs/_order.yaml
  const orderYamlPath = path.join(DOCS_DIR, '_order.yaml');
  console.log(`📝 Writing new order to: ${orderYamlPath}`);
  const newOrderContent = `- istanbul-escort-hizmetleri-2026-drkcn\n- istanbul-escort-bayanlar\n- istanbul-bercem-engez-escort-2026\n`;
  fs.writeFileSync(orderYamlPath, newOrderContent, 'utf8');

  // 3. Update Frontmatter category blocks for all markdown files in each folder
  const foldersToProcess = [
    { dir: drkcnFolder, categoryUri: 'istanbul-escort-hizmetleri-2026-drkcn' },
    { dir: targetEscort, categoryUri: 'istanbul-escort-bayanlar' },
    { dir: targetBercem, categoryUri: 'istanbul-bercem-engez-escort-2026' }
  ];

  for (const item of foldersToProcess) {
    if (!fs.existsSync(item.dir)) {
      console.log(`⚠️ Folder not found for processing: ${item.dir}`);
      continue;
    }

    console.log(`🔍 Processing files in: ${item.dir} -> Category URI: ${item.categoryUri}`);
    const files = walkDirs(item.dir);
    let count = 0;
    for (const file of files) {
      cleanAndWriteFrontmatter(file, item.categoryUri);
      count++;
    }
    console.log(`✅ Processed ${count} files in ${path.basename(item.dir)}`);
  }

  console.log('🎉 Category renaming and frontmatter synchronization complete!');
}

main().catch(console.error);
