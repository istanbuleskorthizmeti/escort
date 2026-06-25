import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const SOURCE_DIR = path.join(DESKTOP_PATH, 'readme-docs-dorukcanay');
const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0';
const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";
const GITHUB_PAT = process.env.GITHUB_PAT;
const REPO_URL = process.env.GITHUB_REPO_URL || 'https://github.com/istanbuleskorthizmeti/eskortguvenlik.git';

async function run() {
  console.log(`🚀 Starting ReadMe Git-Backed Sync for v1.0 Branch to: ${CLONE_DIR}`);

  // 1. Ensure source folder exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source folder ${SOURCE_DIR} does not exist. Run generate-dorukcanay-readme.ts first.`);
    process.exit(1);
  }

  // 2. Create docs/istanbul-escorts directory in the clone
  const docsPath = path.join(CLONE_DIR, 'docs', 'istanbul-escorts');
  if (fs.existsSync(docsPath)) {
    fs.rmSync(docsPath, { recursive: true, force: true });
  }
  fs.mkdirSync(docsPath, { recursive: true });

  // 3. Copy Markdown files from source to docs/istanbul-escorts/
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

  // 4. Write IndexNow verification file to clone root
  console.log(`📝 Writing IndexNow verification file: ${INDEX_NOW_KEY}.txt`);
  fs.writeFileSync(path.join(CLONE_DIR, `${INDEX_NOW_KEY}.txt`), INDEX_NOW_KEY);

  // 5. Write Google Site Verification HTML files to clone root
  console.log(`📝 Writing Google Site Verification HTML files...`);
  fs.writeFileSync(path.join(CLONE_DIR, `googleblR9C6PaZE-_yAVhnbK7o9PD1IWmlxQUzVnGMf3fHrI.html`), `google-site-verification: googleblR9C6PaZE-_yAVhnbK7o9PD1IWmlxQUzVnGMf3fHrI.html`);
  fs.writeFileSync(path.join(CLONE_DIR, `googlec1422bd3f4fe6463.html`), `google-site-verification: googlec1422bd3f4fe6463.html`);


  // 6. Write _order.yaml inside docs/istanbul-escorts/
  console.log('📝 Writing _order.yaml navigation files...');
  const orderListArray = markdownFiles
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
  
  // Move 'istanbul-escort' to the top of navigation
  const mainIndex = orderListArray.indexOf('istanbul-escort');
  if (mainIndex > -1) {
    orderListArray.splice(mainIndex, 1);
    orderListArray.unshift('istanbul-escort');
  }
  
  const orderList = orderListArray.map(item => `- ${item}`).join('\n');
  fs.writeFileSync(path.join(docsPath, '_order.yaml'), orderList + '\n');

  // 7. Update docs/_order.yaml in the clone root to include istanbul-escorts
  const docsOrderPath = path.join(CLONE_DIR, 'docs', '_order.yaml');
  fs.writeFileSync(docsOrderPath, `- Getting Started\n- istanbul-escorts\n`);

  // 8. Commit & Push to v1.0 branch
  console.log('📤 Committing and pushing to GitHub (v1.0 branch)...');
  try {
    execSync('git config user.name "Sovereign Elite"', { cwd: CLONE_DIR });
    execSync('git config user.email "info@dorukcanay.digital"', { cwd: CLONE_DIR });

    execSync('git add .', { cwd: CLONE_DIR });
    try {
      execSync('git commit -m "docs: deploy istanbul escort directory network to readme v1.0"', { cwd: CLONE_DIR });
    } catch (e) {
      console.log('ℹ️ No new changes to commit or commit skipped.');
    }

    const token = process.env.ISTANBUL_ESKORT_GITHUB_PAT || '';
    const authenticatedRemote = REPO_URL.replace('https://', `https://${token}@`);


    // Set remote URL
    try {
      execSync('git remote remove origin', { cwd: CLONE_DIR, stdio: 'ignore' });
    } catch (e) {}
    execSync(`git remote add origin ${authenticatedRemote}`, { cwd: CLONE_DIR });

    console.log('🚀 Pushing to origin v1.0...');
    execSync('git push origin v1.0 --force', { cwd: CLONE_DIR, stdio: 'inherit' });

    console.log('🚀 Pushing to origin main...');
    execSync('git push origin HEAD:main --force', { cwd: CLONE_DIR, stdio: 'inherit' });
    console.log('🎉 Push to v1.0 branch successful!');
  } catch (err: any) {
    console.error('❌ Failed during Git operation:', err.message);
  }
}

run().catch(console.error);
