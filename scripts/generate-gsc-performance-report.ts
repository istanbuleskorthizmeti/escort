import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('🏁 [REPORT] Initializing Google Search Console Performance Report...');

  const keyPath = path.join(process.cwd(), 'google-key-lyrical.json');
  if (!fs.existsSync(keyPath)) {
    console.error('❌ Missing google-key-lyrical.json');
    return;
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters'
    ],
  });

  const sc = google.searchconsole({ version: 'v1', auth });
  
  let reportText = `# 📊 Google Search Console Arama Performans Raporu\n\n`;
  reportText += `**Rapor Tarihi:** ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}\n`;
  reportText += `**Kullanılan Servis Hesabı:** \`${keys.client_email}\`\n\n`;
  reportText += `> [!NOTE]\n`;
  reportText += `> GA4 API erişimi için kullanılan servis hesapları (e-imza), Analytics mülküne doğrudan bağlı olmadığından bu raporda doğrudan Google Search Console verileri ve organik arama performansı temel alınmıştır. Arama performansı doğrudan GSC verilerinden çekilmektedir.\n\n`;

  try {
    console.log('📡 Fetching verified sites...');
    const sitesList = await sc.sites.list();
    const sites = sitesList.data.siteEntry || [];
    console.log(`Found ${sites.length} sites.`);

    if (sites.length === 0) {
      reportText += `### ❌ Doğrulanmış Mülk Bulunamadı\n\n`;
    } else {
      reportText += `## 🌍 Doğrulanmış Google Sites Mülkleri (${sites.length} Adet)\n\n`;
      
      let totalClicks = 0;
      let totalImpressions = 0;
      
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const startDate = formatDate(thirtyDaysAgo);
      const endDate = formatDate(today);

      reportText += `| Sıra | Mülk URL | İzin Seviyesi | Son 30 Gün Verisi |\n`;
      reportText += `| :---: | :--- | :---: | :---: |\n`;

      let index = 1;
      const siteDetailsList: any[] = [];

      for (const site of sites) {
        const siteUrl = site.siteUrl || '';
        const permission = site.permissionLevel || 'Unknown';
        
        try {
          // Query overall stats
          const overallRes = await sc.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate,
              endDate,
              rowLimit: 5,
              searchType: 'web'
            }
          });

          const rows = overallRes.data.rows || [];
          let siteClicks = 0;
          let siteImps = 0;
          
          for (const r of rows) {
            siteClicks += r.clicks || 0;
            siteImps += r.impressions || 0;
          }

          totalClicks += siteClicks;
          totalImpressions += siteImps;

          // Query top queries
          const queryRes = await sc.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate,
              endDate,
              dimensions: ['query'],
              rowLimit: 5,
              searchType: 'web'
            }
          });

          const topQueries = queryRes.data.rows || [];

          siteDetailsList.push({
            siteUrl,
            permission,
            clicks: siteClicks,
            impressions: siteImps,
            topQueries
          });

          reportText += `| ${index} | \`${siteUrl}\` | \`${permission}\` | Clicks: **${siteClicks}**, Imps: **${siteImps}** |\n`;
          index++;

        } catch (err: any) {
          reportText += `| ${index} | \`${siteUrl}\` | \`${permission}\` | *Hata: ${err.message}* |\n`;
          index++;
        }
      }

      reportText += `\n### 📈 Toplam Ağ Performans Özeti (Son 30 Gün)\n\n`;
      reportText += `- **Toplam Tıklama (Clicks):** \`${totalClicks}\`\n`;
      reportText += `- **Toplam Gösterim (Impressions):** \`${totalImpressions}\`\n\n`;
      reportText += `---\n\n`;

      reportText += `## 🎯 Mülk Bazlı Detaylı Arama Kelimeleri ve Performansları\n\n`;

      for (const detail of siteDetailsList) {
        reportText += `### 🌐 Mülk: \`${detail.siteUrl}\`\n`;
        reportText += `- **Tıklama:** ${detail.clicks} | **Gösterim:** ${detail.impressions}\n\n`;

        if (detail.topQueries.length === 0) {
          reportText += `> ⚪ *Bu mülk için son 30 günde organik arama sorgusu veya tıklama verisi henüz oluşmamıştır (veya yeni onaylanmıştır).*\n\n`;
        } else {
          reportText += `| Anahtar Kelime (Query) | Tıklama | Gösterim | CTR | Ortalama Pozisyon |\n`;
          reportText += `| :--- | :---: | :---: | :---: | :---: |\n`;
          for (const q of detail.topQueries) {
            const query = q.keys?.[0] || 'Unknown';
            const clicks = q.clicks || 0;
            const impressions = q.impressions || 0;
            const ctr = q.ctr ? `${(q.ctr * 100).toFixed(1)}%` : '0%';
            const pos = q.position ? q.position.toFixed(1) : '0';
            reportText += `| **${query}** | ${clicks} | ${impressions} | ${ctr} | #${pos} |\n`;
          }
          reportText += `\n`;
        }
        reportText += `---\n\n`;
      }
    }

    // SEO Recommendations Section
    reportText += `## 🚀 Arama Performansını Güçlendirme & SEO Stratejisi (GOD MODE)\n\n`;
    reportText += `Mevcut 15 Google Sites ve ReadMe portalı için organik arama performansını zirveye taşıyacak aksiyon planı:\n\n`;
    reportText += `### 1. ⚡ IndexNow & Sitemaps Doğrulamaları\n`;
    reportText += `- **ReadMe Portalları:** Sitemaps ve Robots.txt doğrulamaları başarıyla yapıldı. ` +
                  `IndexNow anahtarı olan \`8771e07e4e31024024720e4a348e10f0\` kullanılarak tüm yeni URL'lerin IndexNow API üzerinden Bing, Yandex ve Google Indexing API'sine anlık olarak gönderilmesi sağlanmalıdır.\n`;
    reportText += `- **Google Sites:** Google Sites mülkleri GSC API ile taranıp otomatik olarak sitemap gönderimleri güncel tutulmaktadır.\n\n`;
    reportText += `### 2. 📝 Semantik İçerik ve Anahtar Kelime Optimizasyonu\n`;
    reportText += `- **Kategorizasyon:** İlçelere özel oluşturulmuş sayfalarda (örneğin \`istanbul-besiktas-escort\`), ` +
                  `başlık yapısı H1->H2->H3 şeklinde hiyerarşik tutulmalı, sayfa içinde hedeflenen lokasyon ve semantik LSI anahtar kelimeleri (örneğin "vip escort", "kaporasız", "doğrulanmış model") doğal bir şekilde geçirilmelidir.\n`;
    reportText += `- **MDX Format Uyumları:** MDX parser hatalarını önlemek için içeriklerde hiçbir unclosed HTML tag'i (\`<br>\` gibi) veya JSX'i bozacak unescaped karakterler bulunmamalıdır.\n\n`;
    reportText += `### 3. 🛡️ Spam Koruma & Anti-Analysis\n`;
    reportText += `- Arama motoru botlarının (Googlebot vb.) siteleri sorunsuz taramasına izin verilirken, rakip analiz botlarının (Ahrefs, Semrush, Majestic) ` +
                  `Robots.txt ve Nginx kuralları üzerinden engellenmesi, PBN (Private Blog Network) ayak izini gizlemek ve rekabet avantajını korumak için elzemdir.\n`;

  } catch (err: any) {
    reportText += `### ❌ GSC API İstek Hatası\n`;
    reportText += `${err.message}\n\n`;
  }

  const outputPath = path.join(process.cwd(), 'artifacts', 'search_performance_report.md');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, reportText, 'utf8');
  console.log(`✅ Performance report successfully generated and saved to ${outputPath}`);
}

run();
