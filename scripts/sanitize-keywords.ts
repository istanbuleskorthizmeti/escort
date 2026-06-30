import fs from 'fs';
import path from 'path';

// ⚡ GOD MODE: SEO Keyword & Typography Sanitizer ⚡
const TARGET_DIRECTORIES = ['app', 'components', 'seo-texts', 'scratch'];
const IGNORE_DIRECTORIES = ['node_modules', '.next', '.git', 'dist'];
const TARGET_EXTENSIONS = ['.tsx', '.ts', '.md', '.mdx', '.json'];

const TYPO_MAP = [
  { pattern: /\b(esccort|esckort|escrt|escorrt|eacort|escortt|ecsort)\b/gi, replacement: 'escort' },
  { pattern: /\b(eskkort|eskoort|eskorrt|eskortt|eksprt|eskkort)\b/gi, replacement: 'eskort' },
];

function preserveCase(match: string, replacement: string) {
  if (match === match.toUpperCase()) return replacement.toUpperCase();
  if (match[0] === match[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  return replacement;
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let hasChanges = false;

  TYPO_MAP.forEach(({ pattern, replacement }) => {
    if (pattern.test(newContent)) {
      hasChanges = true;
      newContent = newContent.replace(pattern, (match) => preserveCase(match, replacement));
    }
  });

  const punctuationRegex = /\b(escort|eskort)([\.,\!\?])(?=[^\s\"])/gi;
  if (punctuationRegex.test(newContent)) {
    hasChanges = true;
    newContent = newContent.replace(punctuationRegex, '$1$2 ');
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Düzeltildi: ${filePath}`);
  }
}

function walkDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRECTORIES.includes(file)) {
        walkDir(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (TARGET_EXTENSIONS.includes(ext)) {
        try {
          processFile(fullPath);
        } catch (err: any) {
          console.error(`❌ Hata (${fullPath}):`, err.message);
        }
      }
    }
  }
}

console.log('🚀 God Mode: SEO Keyword Sanitizer Başlatılıyor...');
TARGET_DIRECTORIES.forEach(dir => {
  const fullDirPath = path.join(process.cwd(), dir);
  walkDir(fullDirPath);
});
console.log('✅ Operasyon Tamamlandı. Tüm anahtar kelimeler sterilize edildi.');
