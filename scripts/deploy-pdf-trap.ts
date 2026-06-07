import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const HOST = 'escort-randevu.stoplight.io';
const BING_INDEX_NOW = 'https://www.bing.com/indexnow';
const INDEX_NOW_KEY = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';

const pdfFileName = 'ULTIMATE_VIP_GUIDE_2026.pdf';
const localPdfPath = path.join(process.cwd(), 'public', pdfFileName);
const publicRepoUrl = 'https://github.com/guondyshop-del/escortistanbul.git';

async function runDeployPdf() {
  console.log('🧛‍♂️ [PDF DEPLOYMENT] Publishing native PDF trap to public repository...');
  console.log('----------------------------------------------------------------------');

  if (!fs.existsSync(localPdfPath)) {
    console.error(`❌ PDF file not found at: ${localPdfPath}. Please run the generator first.`);
    return;
  }

  const execSync = require('child_process').execSync;
  try {
    const tempDir = path.join(process.cwd(), 'pdf-temp');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    // Copy necessary assets
    fs.copyFileSync(path.join(process.cwd(), 'crawler-trap.md'), path.join(tempDir, 'README.md'));
    fs.copyFileSync(localPdfPath, path.join(tempDir, pdfFileName));

    // Also include rss.xml from GitHub if we have it locally or can regenerate it,
    // let's check if rss.xml template exists in repo or copy from last push structure
    const localRss = path.join(process.cwd(), 'rss.xml');
    // We deleted rss.xml locally in the previous cleanup step. Let's rebuild it or ignore.
    // We can just keep it simple, if rss.xml exists, copy it, else ignore.
    if (fs.existsSync(localRss)) {
      fs.copyFileSync(localRss, path.join(tempDir, 'rss.xml'));
    }

    // Git configuration and deploy
    execSync('git init', { cwd: tempDir });
    execSync('git checkout -b main', { cwd: tempDir });
    execSync('git add .', { cwd: tempDir });
    execSync('git commit -m "feat: publish ultimate PDF guide & sitemap update"', { cwd: tempDir });
    execSync(`git push ${publicRepoUrl} main --force`, { cwd: tempDir });
    fs.rmSync(tempDir, { recursive: true, force: true });

    const rawPdfUrl = `https://raw.githubusercontent.com/guondyshop-del/escortistanbul/main/${pdfFileName}`;
    console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');
    console.log('🏆 [SUCCESS] ULTIMATE PDF DEPLOYED!');
    console.log(`🔗 Raw PDF Target: ${rawPdfUrl}`);
    console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');

    // Trigger immediate IndexNow ping for the raw PDF
    console.log('📡 Informing IndexNow engine...');
    const indexNowUrl = `${BING_INDEX_NOW}?url=${encodeURIComponent(rawPdfUrl)}&key=${INDEX_NOW_KEY}`;
    await axios.get(indexNowUrl);
    console.log('✅ IndexNow notified.');

    // Trigger Google Sitemap style ping
    console.log('📡 Informing Google search crawler...');
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(rawPdfUrl)}`;
    await axios.get(googlePingUrl);
    console.log('✅ Google search crawler notified.');

  } catch (err: any) {
    console.error('❌ PDF Deployment / Ping Failed:', err.message);
  }
}

runDeployPdf().catch(console.error);
