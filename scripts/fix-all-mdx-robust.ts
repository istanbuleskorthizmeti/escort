import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

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

function cleanMarkdownContent(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // 1. Remove style blocks <style>...</style>
  content = content.replace(/<style>[\s\S]*?<\/style>/gi, '');

  // 2. Remove Google Verification meta tag
  content = content.replace(/<meta name="google-site-verification"[\s\S]*?\/>/gi, '');

  // 3. Replace unclosed <br> tags with XHTML compliant <br />
  content = content.replace(/<br>/gi, '<br />');

  // 4. Strip inline style attributes from any HTML tags (e.g. style="...")
  // This matches style="..." or style='...' inside tags and removes them.
  // We use a regex that looks for style attribute inside <...> tag.
  content = content.replace(/(<[a-zA-Z0-9]+[^>]*?\s)style=["'][^"']*["']/gi, '$1');

  // Also clean up any double spaces inside tags
  content = content.replace(/(<[a-zA-Z0-9]+[^>]*?)\s{2,}/gi, '$1 ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function processRepo(cloneDir: string, repoUrl: string, token: string) {
  const baseDocsDir = path.join(cloneDir, 'docs');
  console.log(`\n🧹 Starting recursive MDX Cleanup in: ${baseDocsDir}`);

  if (!fs.existsSync(baseDocsDir)) {
    console.warn(`⚠️ docs directory not found in ${cloneDir}, skipping...`);
    return;
  }

  const mdFiles = walkDirs(baseDocsDir);
  let fixedCount = 0;

  for (const filePath of mdFiles) {
    if (cleanMarkdownContent(filePath)) {
      fixedCount++;
    }
  }

  console.log(`✅ Fixed MDX inline style/XHTML issues in ${fixedCount} files inside ${cloneDir}!`);

  if (fixedCount > 0 || true) {
    console.log(`📤 Committing and pushing updates for: ${cloneDir}`);
    try {
      execSync('git config user.name "Sovereign Elite"', { cwd: cloneDir });
      execSync('git config user.email "info@dorukcanay.digital"', { cwd: cloneDir });

      execSync('git add .', { cwd: cloneDir });
      try {
        execSync('git commit -m "docs: fix MDXish rendering issues by stripping inline styles and non-xhtml tags"', { cwd: cloneDir });
      } catch (e) {
        console.log('ℹ️ No new changes to commit or commit skipped.');
      }

      const authenticatedRemote = repoUrl.replace('https://', `https://${token}@`);

      try {
        execSync('git remote remove origin', { cwd: cloneDir, stdio: 'ignore' });
      } catch (e) {}
      execSync(`git remote add origin ${authenticatedRemote}`, { cwd: cloneDir });

      console.log('🚀 Pushing to origin v1.0...');
      execSync('git -c credential.helper= push origin v1.0 --force', { cwd: cloneDir, stdio: 'inherit' });

      console.log('🚀 Pushing to origin main...');
      try {
        execSync('git -c credential.helper= push origin HEAD:main --force', { cwd: cloneDir, stdio: 'inherit' });
      } catch (err: any) {
        console.warn('⚠️ Push to main branch failed (might be protected), but v1.0 pushed successfully.');
      }

      console.log(`🎉 Git updates completed for ${cloneDir}!`);
    } catch (err: any) {
      console.error(`❌ Failed during Git operation for ${cloneDir}:`, err.message);
    }
  }
}

async function run() {
  // Repo 1: tamkumarbaz/tamkumarbaz
  const clone1 = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
  const url1 = 'https://github.com/tamkumarbaz/tamkumarbaz.git';
  const token1 = process.env.GITHUB_PAT || '';
  await processRepo(clone1, url1, token1);

  // Repo 2: istanbuleskorthizmeti/eskortguvenlik
  const clone2 = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0';
  const url2 = 'https://github.com/istanbuleskorthizmeti/eskortguvenlik.git';
  const token2 = process.env.ISTANBUL_ESKORT_GITHUB_PAT || '';
  await processRepo(clone2, url2, token2);
}

run().catch(console.error);
