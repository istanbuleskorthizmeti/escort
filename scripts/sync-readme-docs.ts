import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const README_API_KEY = process.env.README_API_KEY;
const DEFAULT_CATEGORY = 'istanbul-escorts';

async function sync() {
  if (!README_API_KEY) {
    console.error("❌ Error: README_API_KEY is not defined in environment variables or .env file.");
    process.exit(1);
  }

  const category = process.env.README_CATEGORY || DEFAULT_CATEGORY;
  const folderPath = path.join(DESKTOP_PATH, 'readme-docs');

  // Ensure fresh build of local files first
  console.log("🔨 Step 1: Re-building ReadMe Markdown pages locally...");
  execSync(`npx tsx scripts/generate-readme-project.ts --category=${category}`, { stdio: 'inherit' });

  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Docs folder not found: ${folderPath}`);
    process.exit(1);
  }

  console.log(`📡 Step 2: Uploading Markdown fleet to ReadMe.io project via rdme CLI...`);
  try {
    // Execute global rdme command to sync docs folder
    // Uses the API Key to authenticate the sync process securely
    const cmd = `npx rdme docs:upload "${folderPath}" --key=${README_API_KEY}`;
    console.log(`🚀 Executing command: rdme docs:upload "${folderPath}"`);
    
    const output = execSync(cmd, { encoding: 'utf8', input: 'y\n' });
    console.log("--- CLI OUTPUT ---");
    console.log(output);
    console.log("🏆 Sync process finished successfully!");
  } catch (err: any) {
    console.error("❌ ReadMe Sync Command Failed:", err.message);
    if (err.stdout) console.log("STDOUT:", err.stdout);
    if (err.stderr) console.error("STDERR:", err.stderr);
  }
}

sync().catch(console.error);
