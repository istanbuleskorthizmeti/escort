import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-escort';
const DOCS_DIR = path.join(CLONE_DIR, 'docs');
const TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_URL = 'https://github.com/istanbuleskorthizmeti/escort.git';

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
  content = content.replace(/(<[a-zA-Z0-9]+[^>]*?\s)style=["'][^"']*["']/gi, '$1');

  // Also clean up any double spaces inside tags
  content = content.replace(/(<[a-zA-Z0-9]+[^>]*?)\s{2,}/gi, '$1 ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function run() {
  console.log(`🧹 Starting recursive MDX Cleanup in escort repo: ${DOCS_DIR}`);

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ docs directory not found in ${CLONE_DIR}`);
    process.exit(1);
  }

  const mdFiles = walkDirs(DOCS_DIR);
  let fixedCount = 0;

  for (const filePath of mdFiles) {
    if (cleanMarkdownContent(filePath)) {
      fixedCount++;
    }
  }

  console.log(`✅ Fixed MDX issues in ${fixedCount} files inside ${CLONE_DIR}!`);

  console.log(`📤 Committing and pushing updates to ${REPO_URL}...`);
  try {
    execSync('git config user.name "Sovereign Elite"', { cwd: CLONE_DIR });
    execSync('git config user.email "info@dorukcanay.digital"', { cwd: CLONE_DIR });

    execSync('git add .', { cwd: CLONE_DIR });
    try {
      execSync('git commit -m "docs: resolve MDXish rendering errors by stripping inline styles and unclosed tags"', { cwd: CLONE_DIR });
    } catch (e) {
      console.log('ℹ️ No new changes to commit or commit skipped.');
    }

    const authenticatedRemote = REPO_URL.replace('https://', `https://${TOKEN}@`);

    try {
      execSync('git remote remove origin', { cwd: CLONE_DIR, stdio: 'ignore' });
    } catch (e) {}
    execSync(`git remote add origin ${authenticatedRemote}`, { cwd: CLONE_DIR });

    console.log('🚀 Pushing to origin v1.0...');
    execSync('git -c credential.helper= push origin v1.0 --force', { cwd: CLONE_DIR, stdio: 'inherit' });

    console.log('🚀 Pushing to origin main...');
    try {
      execSync('git -c credential.helper= push origin HEAD:main --force', { cwd: CLONE_DIR, stdio: 'inherit' });
    } catch (err: any) {
      console.warn('⚠️ Push to main branch failed (might be protected), but v1.0 pushed successfully.');
    }

    console.log(`🎉 Git updates completed successfully for escort repo!`);
  } catch (err: any) {
    console.error(`❌ Failed during Git operation:`, err.message);
  }
}

run().catch(console.error);
