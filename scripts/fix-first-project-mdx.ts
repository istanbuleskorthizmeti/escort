import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
const DOCS_DIR = path.join(CLONE_DIR, 'docs', 'istanbul-escort-hizmetleri-2026-drkcn');
const GITHUB_PAT = process.env.GITHUB_PAT;
const REPO_URL = 'https://github.com/tamkumarbaz/tamkumarbaz.git';

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

async function run() {
  const baseDocsDir = path.join(CLONE_DIR, 'docs');
  console.log(`🧹 Starting recursive MDX Cleanup in: ${baseDocsDir}`);

  const mdFiles = walkDirs(baseDocsDir);
  let fixedCount = 0;

  for (const filePath of mdFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Remove style block
    content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

    // 2. Replace the div style banner with a clean, MDX-compliant blockquote alert
    const divRegex = /<div style="background: linear-gradient[\s\S]*?<\/div>/g;
    const cleanBanner = `> [!IMPORTANT]\n> ### 👑 BAĞIMSIZ MODEL İLANINIZI YAYINLAYIN\n> İstanbul genelinde günlük yüzbinlerce ziyaretçiye ulaşan vitrinimizde yerinizi alın. Kaporasız ve elden ödemeli VIP profilinizle kazanmaya başlayın.\n> **[✨ İLAN VERMEK İÇİN TIKLAYINIZ (Elden Ödemeli)](https://dorukcanay.digital)**`;
    content = content.replace(divRegex, cleanBanner);

    // 3. Remove Google Verification meta tag
    content = content.replace(/<meta name="google-site-verification"[\s\S]*?\/>/g, '');

    // 4. Replace unclosed <br> tags with XHTML compliant <br />
    content = content.replace(/<br>/g, '<br />');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
    }
  }

  console.log(`✅ Fixed MDX inline style issues in ${fixedCount} files!`);

  // Push updates to Git remote
  console.log('📤 Committing and pushing to tamkumarbaz/tamkumarbaz repository...');
  try {
    execSync('git config user.name "Sovereign Elite"', { cwd: CLONE_DIR });
    execSync('git config user.email "info@dorukcanay.digital"', { cwd: CLONE_DIR });

    execSync('git add .', { cwd: CLONE_DIR });
    try {
      execSync('git commit -m "docs: resolve MDXish rendering errors by stripping inline style and style tags"', { cwd: CLONE_DIR });
    } catch (e) {
      console.log('ℹ️ No new changes to commit or commit skipped.');
    }

    const token = GITHUB_PAT;
    const authenticatedRemote = REPO_URL.replace('https://', `https://${token}@`);



    // Set remote URL
    try {
      execSync('git remote remove origin', { cwd: CLONE_DIR, stdio: 'ignore' });
    } catch (e) {}
    execSync(`git remote add origin ${authenticatedRemote}`, { cwd: CLONE_DIR });

    console.log('🚀 Pushing to origin v1.0...');
    execSync('git push origin v1.0', { cwd: CLONE_DIR, stdio: 'inherit' });

    console.log('🚀 Pushing to origin main...');
    execSync('git push origin HEAD:main --force', { cwd: CLONE_DIR, stdio: 'inherit' });

    console.log('🎉 Push to tamkumarbaz/tamkumarbaz successful!');
  } catch (err: any) {
    console.error('❌ Failed during Git operation:', err.message);
  }
}

run().catch(console.error);
