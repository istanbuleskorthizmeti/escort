import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
const DOCS_DIR = path.join(CLONE_DIR, 'docs');
const TARGET_FOLDER = path.join(DOCS_DIR, 'istanbul-escort-hizmetleri-2026-drkcn');
const OLD_FOLDER = path.join(DOCS_DIR, 'uri-that-does-not-map-to-dorukcanay-vip');

async function run() {
  console.log('🧹 Starting removal of dorukcanay-vip category from the first project...');

  // 1. Delete the folders if they exist
  if (fs.existsSync(TARGET_FOLDER)) {
    console.log(`🗑️ Deleting folder: ${TARGET_FOLDER}`);
    fs.rmSync(TARGET_FOLDER, { recursive: true, force: true });
  } else {
    console.log(`ℹ️ Folder not found: ${TARGET_FOLDER}`);
  }

  if (fs.existsSync(OLD_FOLDER)) {
    console.log(`🗑️ Deleting folder: ${OLD_FOLDER}`);
    fs.rmSync(OLD_FOLDER, { recursive: true, force: true });
  }

  // 2. Update _order.yaml
  const orderYamlPath = path.join(DOCS_DIR, '_order.yaml');
  console.log(`📝 Updating order in: ${orderYamlPath}`);
  const newOrderContent = `- istanbul-escort-bayanlar\n- istanbul-bercem-engez-escort-2026\n`;
  fs.writeFileSync(orderYamlPath, newOrderContent, 'utf8');

  // 3. Commit and Push to Git
  console.log('📤 Committing and pushing changes to tamkumarbaz/tamkumarbaz repository...');
  try {
    execSync('git config user.name "Sovereign Elite"', { cwd: CLONE_DIR });
    execSync('git config user.email "info@dorukcanay.digital"', { cwd: CLONE_DIR });

    // Clean untracked files if any
    try {
      execSync('git clean -fd', { cwd: CLONE_DIR });
    } catch (e) {}

    // Add all changes (including deletions)
    execSync('git add -A', { cwd: CLONE_DIR });

    try {
      execSync('git commit -m "docs: remove dorukcanay-vip category and district pages from first project"', { cwd: CLONE_DIR });
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

run().catch(console.error);
