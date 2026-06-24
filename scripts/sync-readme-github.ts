import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const TARGET_DIR = path.join(DESKTOP_PATH, 'dorukcanay-docs-git');
const SOURCE_DIR = path.join(DESKTOP_PATH, 'readme-docs-dorukcanay');
const REPO_URL = process.env.GITHUB_REPO_URL || 'https://github.com/tamkumarbaz/tamkumarbaz.git';
const GITHUB_PAT = process.env.GITHUB_PAT;
const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";

const readmeSubdomain = process.env.README_SUBDOMAIN || "istanbul-eskort-hizmeti";

async function run() {
  console.log(`🚀 Starting ReadMe Git-Backed Sync to: ${TARGET_DIR}`);

  // 1. Create target directory
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 2. Initialize Git if not exists
  const gitDir = path.join(TARGET_DIR, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log('🐙 Initializing git repository...');
    execSync('git init', { cwd: TARGET_DIR });
  }

  // 3. Clean files in target directory, except .git
  console.log('🧹 Cleaning old files in target repository...');
  const files = fs.readdirSync(TARGET_DIR);
  for (const file of files) {
    if (file === '.git') continue;
    const filePath = path.join(TARGET_DIR, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }

  // 4. Create docs/istanbul-escorts subfolder
  const docsPath = path.join(TARGET_DIR, 'docs', 'istanbul-escorts');
  fs.mkdirSync(docsPath, { recursive: true });

  // 5. Copy Markdown files from source to target docs folder
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source folder ${SOURCE_DIR} does not exist. Run generate-readme-project first.`);
    process.exit(1);
  }

  console.log(`📋 Copying files from ${SOURCE_DIR} to ${docsPath}...`);
  const markdownFiles = fs.readdirSync(SOURCE_DIR);
  let count = 0;
  for (const mdFile of markdownFiles) {
    if (mdFile.endsWith('.md')) {
      const srcFile = path.join(SOURCE_DIR, mdFile);
      const destFile = path.join(docsPath, mdFile);
      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  }
  console.log(`✅ Copied ${count} files.`);

  // 6. Create custom_pages and custom_blocks placeholders if needed (optional)
  fs.mkdirSync(path.join(TARGET_DIR, 'custom_pages'), { recursive: true });

  // 6.5 Write IndexNow verification file to target directory root
  console.log(`📝 Writing IndexNow verification file: ${INDEX_NOW_KEY}.txt`);
  fs.writeFileSync(path.join(TARGET_DIR, `${INDEX_NOW_KEY}.txt`), INDEX_NOW_KEY);

  console.log(`📝 Writing Google Site Verification HTML file...`);
  fs.writeFileSync(path.join(TARGET_DIR, `googleblR9C6PaZE-_yAVhnbK7o9PD1IWmlxQUzVnGMf3fHrI.html`), `google-site-verification: googleblR9C6PaZE-_yAVhnbK7o9PD1IWmlxQUzVnGMf3fHrI.html`);

  console.log(`📝 Writing robots.txt file...`);
  fs.writeFileSync(path.join(TARGET_DIR, `robots.txt`), `User-agent: *\nAllow: /\n\nSitemap: https://${readmeSubdomain}.readme.io/sitemap.xml\n`);

  // 7. Write a simple _order.yaml inside docs/istanbul-escorts to establish sequence
  console.log('📝 Writing _order.yaml navigation files...');
  fs.writeFileSync(path.join(TARGET_DIR, 'docs', '_order.yaml'), `istanbul-escorts\n`);
  
  const orderListArray = markdownFiles
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
  
  // Explicitly move 'istanbul-escort' to the absolute top of the navigation order
  const mainIndex = orderListArray.indexOf('istanbul-escort');
  if (mainIndex > -1) {
    orderListArray.splice(mainIndex, 1);
    orderListArray.unshift('istanbul-escort');
  }
  
  const orderList = orderListArray.join('\n');
  fs.writeFileSync(path.join(docsPath, '_order.yaml'), orderList + '\n');

  let authenticatedRemote = REPO_URL;
  if (GITHUB_PAT) {
    console.log('🔑 GITHUB_PAT detected in env, injecting to remote URL for seamless push...');
    authenticatedRemote = REPO_URL.replace('https://', `https://${GITHUB_PAT}@`);
  }

  try {
    execSync('git remote remove origin', { cwd: TARGET_DIR, stdio: 'ignore' });
  } catch (e) {}
  
  execSync(`git remote add origin ${authenticatedRemote}`, { cwd: TARGET_DIR });

  // 9. Commit & Push
  console.log('📤 Committing and pushing to GitHub (main branch)...');
  try {
    // Set local git config to avoid user setup issues
    execSync('git config user.name "Sovereign Elite"', { cwd: TARGET_DIR });
    execSync('git config user.email "info@dorukcanay.digital"', { cwd: TARGET_DIR });

    execSync('git add .', { cwd: TARGET_DIR });
    try {
      execSync('git commit -m "docs: deploy istanbul escort directory network to readme"', { cwd: TARGET_DIR });
    } catch (e) {
      console.log('ℹ️ No new changes to commit or commit skipped.');
    }
    execSync('git branch -M main', { cwd: TARGET_DIR });
    
    console.log('🚀 Pushing to origin main...');
    execSync('git push -u origin main --force', { cwd: TARGET_DIR, stdio: 'inherit' });
    console.log('🎉 Push successful! ReadMe should start syncing the documentation network.');
  } catch (err: any) {
    console.error('❌ Failed during Git operation:', err.message);
  }
}

run().catch(console.error);
