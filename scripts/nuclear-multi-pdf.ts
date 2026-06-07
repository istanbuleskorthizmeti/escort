import PDFDocument from 'pdfkit';
import fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { omniAI } from '../lib/ai-provider';
import { istanbulCity } from '../lib/locations-registry/istanbul';

const BING_INDEX_NOW = 'https://www.bing.com/indexnow';
const INDEX_NOW_KEY = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';
const publicRepoUrl = 'https://github.com/guondyshop-del/escortistanbul.git';

// Dynamic niches to expand semantic variety
const TARGET_REGIONS = [
  { ilce: 'Şişli', title: '2026 Şişli VIP Escort ve İlişki Koçluğu Rehberi' },
  { ilce: 'Beşiktaş', title: 'Beşiktaş Elit Yaşam ve Rus Partner Trendleri 2026' },
  { ilce: 'Beylikdüzü', title: 'Beylikdüzü VIP Görüşme ve Sosyal Esenlik Kılavuzu' },
  { ilce: 'Kadıköy', title: 'Anadolu Yakası VIP Sosyal Statü ve Kadıköy Kültür Kataloğu' },
  { ilce: 'Bakırköy', title: 'Florya ve Bakırköy Lüks Yaşam Danışmanlığı & Partner Seçimleri' }
];

const WA_BRIDGE = "https://wa.me/905520949245?text=Merhaba,%20Premium%202026%20Rehberi%20%C3%BCzerinden%20ula%C5%9F%C4%B1yorum.";

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function createRegionPdf(region: typeof TARGET_REGIONS[0]) {
  const filename = `ultimate-${slugify(region.ilce)}-escort-guide-2026.pdf`;
  const outPath = path.join(process.cwd(), 'public', filename);
  
  console.log(`\n🧠 Generating content via DeepSeek for: ${region.title}...`);
  
  const prompt = `
    Sen Türkiye'nin en seçkin Lüks Yaşam Danışmanısın.
    '${region.title}' başlıklı, 4 bölümden oluşan, 1500+ kelimelik derinlemesine bir rehber yaz.
    İçerik tamamen TÜRKÇE olmalı.
    İçerik şunları kapsamalı:
    1. ${region.ilce} bölgesindeki lüks sosyal yaşam ve elit partner tercihleri.
    2. VIP Görüşmelerde dikkat edilmesi gereken gizlilik ve güvenlik kuralları.
    3. Bölgesel VIP buluşma noktaları (rezidanslar, butik oteller, elit mekanlar).
    4. Kaporasız, güvenli ve teyitli randevu alma pratikleri.

    ÖNEMLİ:
    - Metnin her bölümüne doğal bir şekilde "İletişim Hattı" veya "Rezervasyon Linki" olarak şu adresi enjekte et: ${WA_BRIDGE}
    - Sayfanın en altına bir SEO etiket bulutu oluştur ve lüks escort bayan, vip eskort, rus eskort ilanları gibi yüksek arama hacimli terimleri virgülle ayırarak yerleştir.
  `.trim();

  try {
    const aiText = await omniAI.generate(prompt, {
      provider: 'deepseek',
      model: 'deepseek-chat',
      max_tokens: 3000
    });

    console.log(`✍️ Compiling PDF Kit document for ${region.ilce}...`);
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outPath);
    doc.pipe(writeStream);

    // Title
    doc.fontSize(20).fillColor('#b8860b').text(region.title.toUpperCase(), { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666666').text('Elite Lifestyle & Partner Consulting Services Ltd.', { align: 'center', oblique: true });
    doc.moveDown(1.5);

    // Body split by lines
    const paragraphs = aiText.split('\n');
    paragraphs.forEach(p => {
      const cleanLine = p.trim();
      if (!cleanLine) return;

      if (cleanLine.startsWith('#') || cleanLine.startsWith('Bölüm') || cleanLine.startsWith('1.') || cleanLine.startsWith('2.') || cleanLine.startsWith('3.') || cleanLine.startsWith('4.')) {
        doc.fontSize(13).fillColor('#333333').text(cleanLine.replace(/#/g, '').trim(), { underline: true });
        doc.moveDown(0.5);
      } else {
        doc.fontSize(9.5).fillColor('#111111').text(cleanLine, { align: 'justify' });
        doc.moveDown(0.4);
      }

      // If we find our URL, render a clickable link on top of it
      if (cleanLine.includes('https://wa.me')) {
        doc.fontSize(10).fillColor('#b8860b').text('🔗 TIKLA VE REZERVASYON YAP (WHATSAPP)', {
          link: WA_BRIDGE,
          underline: true
        });
        doc.moveDown(0.5);
      }
    });

    doc.end();
    await new Promise((res, rej) => {
      writeStream.on('finish', () => res(true));
      writeStream.on('error', (err) => rej(err));
    });

    console.log(`✅ PDF successfully generated locally: ${outPath}`);
    return filename;
  } catch (err: any) {
    console.error(`❌ PDF generation failed for ${region.ilce}:`, err.message);
    return null;
  }
}

async function startMultiPdfSiege() {
  console.log('🔥 [HYDRA MULTI-PDF SIEGE] Publishing dynamic region PDFs to search engine crawlers...');
  console.log('---------------------------------------------------------------------------------');

  const generatedFiles: string[] = [];
  
  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate all targeted PDFs
  for (const region of TARGET_REGIONS) {
    const filename = await createRegionPdf(region);
    if (filename) generatedFiles.push(filename);
    // Cool down for AI rate limits
    await new Promise(res => setTimeout(res, 2000));
  }

  if (generatedFiles.length === 0) {
    console.log('❌ No PDF files generated successfully.');
    return;
  }

  // 2. Deploy to public GitHub repo
  console.log('\n🚀 Stage 2: Staging and deploying new PDF files to GitHub...');
  const execSync = require('child_process').execSync;
  try {
    const tempDir = path.join(process.cwd(), 'pdf-multi-temp');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    // Copy sitemap README
    fs.copyFileSync(path.join(process.cwd(), 'crawler-trap.md'), path.join(tempDir, 'README.md'));

    // Copy all generated PDFs
    generatedFiles.forEach(file => {
      fs.copyFileSync(path.join(process.cwd(), 'public', file), path.join(tempDir, file));
    });

    // Git deploy execution
    execSync('git init', { cwd: tempDir });
    execSync('git checkout -b main', { cwd: tempDir });
    execSync('git add .', { cwd: tempDir });
    execSync('git commit -m "feat: publish dynamic region PDF traps"', { cwd: tempDir });
    execSync(`git push ${publicRepoUrl} main --force`, { cwd: tempDir });
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('✅ All PDFs successfully published to GitHub Pages!');
  } catch (gitErr: any) {
    console.error('❌ Git push failed:', gitErr.message);
  }

  // 3. Inform Crawlers (IndexNow & Google Ping)
  console.log('\n🚀 Stage 3: Broad pings to IndexNow and Google crawlers...');
  for (const file of generatedFiles) {
    const targetUrl = `https://raw.githubusercontent.com/guondyshop-del/escortistanbul/main/${file}`;
    console.log(`   🔗 Targeting: ${targetUrl}`);
    
    // Ping IndexNow (Bing/Yandex)
    try {
      const indexNowUrl = `${BING_INDEX_NOW}?url=${encodeURIComponent(targetUrl)}&key=${INDEX_NOW_KEY}`;
      await axios.get(indexNowUrl, { timeout: 4000 });
      console.log('      ✅ IndexNow pinged.');
    } catch (err: any) {
      console.log('      ❌ IndexNow ping failed.');
    }

    // Ping Google
    try {
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(targetUrl)}`;
      await axios.get(googlePingUrl, { timeout: 4000 });
      console.log('      ✅ Google pinged.');
    } catch {
      console.log('      ❌ Google ping failed.');
    }
    await new Promise(res => setTimeout(res, 1000));
  }

  console.log('\n🏆 [DONE] Multi-PDF indexing loop successfully executed.');
}

startMultiPdfSiege().catch(console.error);
