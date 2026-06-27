import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

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

async function run() {
  console.log(`🧹 Scanning and fixing broken frontmatter in: ${DOCS_DIR}`);
  const files = walkDirs(DOCS_DIR);
  let fixedCount = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Fix the specific broken pattern: uri: <category-slug>---
    const regex = /uri:\s*([a-zA-Z0-9-]+)---/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'uri: $1\n---');
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
    }
  }

  console.log(`✅ Successfully fixed frontmatter in ${fixedCount} files!`);

  // Now push to Git remote to update ReadMe.io
  if (fixedCount > 0) {
    console.log('📤 Committing and pushing to tamkumarbaz/tamkumarbaz repository...');
    try {
      execSync('git config user.name "Sovereign Elite"', { cwd: CLONE_DIR });
      execSync('git config user.email "info@dorukcanay.digital"', { cwd: CLONE_DIR });

      execSync('git add .', { cwd: CLONE_DIR });
      try {
        execSync('git commit -m "docs: restore frontmatter syntax by fixing closing boundary"', { cwd: CLONE_DIR });
      } catch (e) {
        console.log('ℹ️ No new changes to commit or commit skipped.');
      }

      const token = process.env.GITHUB_PAT || '';
      const repoUrl = 'https://github.com/tamkumarbaz/tamkumarbaz.git';
      const authenticatedRemote = repoUrl.replace('https://', `https://${token}@`);

      try {
        execSync('git remote remove origin', { cwd: CLONE_DIR, stdio: 'ignore' });
      } catch (e) {}
      execSync(`git remote add origin ${authenticatedRemote}`, { cwd: CLONE_DIR });

      console.log('🚀 Pushing to origin v1.0...');
      execSync('git push origin v1.0 --force', { cwd: CLONE_DIR, stdio: 'inherit' });

      console.log('🚀 Pushing to origin main...');
      execSync('git push origin HEAD:main --force', { cwd: CLONE_DIR, stdio: 'inherit' });

      console.log('🎉 Push to tamkumarbaz/tamkumarbaz successful!');
    } catch (err: any) {
      console.error('❌ Failed during Git operation:', err.message);
    }
  }
}

run().catch(console.error);
