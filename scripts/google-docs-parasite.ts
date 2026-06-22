import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { sendTelegramReport } from '../lib/telegram';
import { omniAI } from '../lib/ai-provider';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

dotenv.config();

const TARGET_ZONES = Object.keys(ISTANBUL_NEIGHBORS);
const MONEY_SITE = "https://istanbulescort.blog";
const PREMIUM_LINK = "https://bit.ly/dorukcanmanay";
const WORKSPACE_EMAIL = "info@dorukcanay.digital";

async function generateDocContent(zone: string): Promise<string> {
  const prompt = `
    Sen bir Elit SEO Uzmanısın. 
    "${zone} Escort | ${zone} VIP Partner | Güvenilir Escort Kataloğu (2026)" başlığı altında, 
    Google Docs üzerinde mükemmel duracak, son derece profesyonel, zengin içerikli ve ikna edici bir HTML dökümanı hazırla.
    
    Aşağıdaki kurallara kesinlikle uy:
    1. HTML yapısında h1, h2, h3, p, strong, ul, li etiketlerini kullan. 
    2. HTML veya BODY etiketlerini ekleme, sadece doğrudan döküman içeriğini kapsayan temiz HTML body parçası gönder.
    3. Metnin içinde ${PREMIUM_LINK} adresine "RESMİ VIP ESCORT KATALOĞU" veya "${zone} Escort Portalı" metinleriyle en az 3 adet link ver.
    4. Kaporasız randevu sistemi, doğrulanmış escort profilleri ve %100 gizlilik prensiplerini vurgula.
    5. Rekabetçi anahtar kelimeleri doğal akışta makaleye dağıt.
  `;
  try {
    return await omniAI.generate(prompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 3000 });
  } catch (err) {
    // Fallback static HTML
    return `
      <h1>${zone} Escort | VIP Partner ve Escort Kataloğu (2026)</h1>
      <p>${zone} bölgesinde en seçkin partner deneyimi için resmi kataloğumuzu ziyaret edebilirsiniz.</p>
      <h2>💎 Güvenilir ve Kaporasız Randevu Portalı</h2>
      <p>Gerçek profiller, kapıda ödeme ve yüksek gizlilik güvencesiyle çalışıyoruz.</p>
      <p><a href="${PREMIUM_LINK}"><strong>👉 RESMİ VIP ESCORT KATALOĞUNU GÖRÜNTÜLEMEK İÇİN TIKLAYIN 👈</strong></a></p>
      <ul>
        <li>%100 Doğrulanmış Fotoğraflar</li>
        <li>Kaporasız Hizmet Politikası</li>
        <li>Profesyonel ve Gizli Randevu Yönetimi</li>
      </ul>
    `;
  }
}

async function runGoogleDocsParasite() {
  console.log("🚀 [GOOGLE-DOCS-PARASITE] Initializing Google APIs...");
  
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }
  
  if (!fs.existsSync(keyPath)) {
    console.error("❌ No Google key file found (tried google-key-sovereign.json and google-key.json)!");
    process.exit(1);
  }

  console.log(`🔑 Using credential file: ${path.basename(keyPath)}`);
  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new google.auth.JWT(
    keys.client_email,
    undefined,
    keys.private_key,
    [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/documents'
    ]
  );

  const drive = google.drive({ version: 'v3', auth });

  console.log("🛡️ [GOOGLE-DOCS-PARASITE] Commencing target doc creation...");
  await sendTelegramReport(`📑 <b>GOOGLE DOCS PARASITE ENGINE ACTIVATED</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n📬 <b>Workspace:</b> <code>${WORKSPACE_EMAIL}</code>\n🎯 <b>Hedef:</b> Google Drive & Docs Parasite Link Generation`);

  // Pick random 5 districts to avoid hitting quotas too fast, can run again for others
  const selectedZones = [...TARGET_ZONES].sort(() => Math.random() - 0.5).slice(0, 5);

  for (const zone of selectedZones) {
    try {
      console.log(`📝 Generating content for: ${zone}...`);
      const htmlContent = await generateDocContent(zone);

      console.log(`📤 Uploading to Google Drive as Google Doc...`);
      
      const fileMetadata = {
        name: `💎 ${zone} Escort | VIP Partner & Escort Kataloğu (2026)`,
        mimeType: 'application/vnd.google-apps.document',
      };

      // Upload HTML buffer converted into a Google Doc
      const media = {
        mimeType: 'text/html',
        body: htmlContent,
      };

      const docFile = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      const docId = docFile.data.id;
      const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
      console.log(`✅ Doc Created: ${docUrl}`);

      // 🔑 Share with workspace email (info@dorukcanay.digital) as writer
      console.log(`🔑 Sharing write access with ${WORKSPACE_EMAIL}...`);
      await drive.permissions.create({
        fileId: docId!,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: WORKSPACE_EMAIL
        }
      });

      // 🌍 Make public so crawlers and visitors can read it
      console.log("🌍 Making document public...");
      await drive.permissions.create({
        fileId: docId!,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      const message = 
        `📑 <b>GOOGLE DOCS SIZINTISI</b>\n` +
        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
        `📍 <b>Bölge:</b> <code>${zone}</code>\n` +
        `🔗 <b>Döküman Linki:</b> <a href="${docUrl}">Google Doc Görüntüle</a>\n` +
        `🔑 <b>Workspace Yetkisi:</b> Paylaşıldı (info@dorukcanay.digital)\n` +
        `🎯 <b>Arama Linki:</b> <a href="${PREMIUM_LINK}">Katalog Girişi</a>\n` +
        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
        `<i>#GoogleDriveParasite #HighAuthorityBacklink #GodMode</i>`;

      await sendTelegramReport(message);
      console.log(`📢 Report sent for ${zone}`);

    } catch (err: any) {
      console.error(`❌ Failed for ${zone}:`, err.message);
    }
  }

  console.log("🏁 [GOOGLE-DOCS-PARASITE] Done.");
  await sendTelegramReport(`🏆 <b>GOOGLE DOCS PARASITE BATCH COMPLETED</b>\nDökümanlar Google Drive'da oluşturulup kamuya ve yetkili maile açıldı.`);
}

runGoogleDocsParasite().catch(console.error);
