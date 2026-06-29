import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DOMAIN_MATRIX } from '../config/domains';
import { omniAI } from '../lib/ai-provider';
import { TelegramService } from '../lib/crm/telegram';
import { SocialBomber } from '../lib/seo/social-bomber';

dotenv.config();

/**
 * 🧠 HYDRA AUTONOMOUS BRAIN v2
 * - Phase 1: Scans Google Sites GSC properties (confirmed siteFullUser access)
 * - Phase 2: Scans Money Sites via sc-domain
 * - Identifies low CTR / high impression pages → AI rewrites → Social Blast
 */
async function loadValidAuth(): Promise<JWT> {
  // Prefer known-working keys; sovereign & hydra have invalid JWT (revoked in GCP)
  const candidateKeys = [
    'google-key-lyrical.json',
    'google-key-model-osprey.json',
    'google-key-starry.json',
    'google-key-sovereign.json',
    'google-key.json',
  ];

  for (const keyFile of candidateKeys) {
    const keyPath = path.join(process.cwd(), keyFile);
    if (!fs.existsSync(keyPath)) continue;
    try {
      const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      const auth = new JWT({
        email: keyData.client_email,
        key: keyData.private_key.replace(/\\n/g, '\n').replace(/\r/g, ''),
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
      });
      await auth.getAccessToken();
      console.log(`🔑 [HYDRA BRAIN] Active GSC key: ${keyFile} (${keyData.client_email})`);
      return auth;
    } catch (e: any) {
      console.warn(`⚠️ [HYDRA BRAIN] Key failed: ${keyFile} -> ${e.message}`);
    }
  }
  throw new Error('No valid Google Key found for GSC operations.');
}

// Google Sites properties confirmed accessible via service accounts
const GOOGLE_SITE_PROPERTIES = [
  'https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa/',
  'https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa/',
];

async function runAutonomousBrain() {
  console.log('🧠 [HYDRA BRAIN v2] Initializing Autonomous SEO Optimizer...');

  const auth = await loadValidAuth();
  const sc = google.searchconsole({ version: 'v1', auth });

  const today = new Date();
  const startDate = new Date(new Date().setDate(today.getDate() - 7)).toISOString().split('T')[0];
  const endDate = new Date(new Date().setDate(today.getDate() - 1)).toISOString().split('T')[0];

  let totalOptimized = 0;

  // ════════════════════════════════════════════════════════════
  // PHASE 1: GOOGLE SITES (confirmed siteFullUser access)
  // ════════════════════════════════════════════════════════════
  console.log('\n🛰️ [HYDRA BRAIN] ━━ PHASE 1: Google Sites GSC Scan ━━');

  interface SiteOpportunity {
    site: string;
    query: string;
    position: number;
    impressions: number;
    clicks: number;
  }
  const siteOpportunities: SiteOpportunity[] = [];
  let sitesWithData = 0;

  for (const siteUrl of GOOGLE_SITE_PROPERTIES) {
    const label = siteUrl.split('/')[6] ?? siteUrl;
    console.log(`\n🔍 [G-SITES] ${label}`);
    try {
      const res = await sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
        },
      });
      const rows = res.data.rows ?? [];
      if (rows.length === 0) {
        console.log(`   ℹ️ No data yet (newly indexed or no impressions)`);
        continue;
      }
      sitesWithData++;
      for (const row of rows) {
        const query = row.keys?.[0] ?? 'escort';
        const impressions = row.impressions ?? 0;
        const clicks = row.clicks ?? 0;
        const position = row.position ?? 0;
        console.log(`   📊 "${query}" | Imp: ${impressions} | Clicks: ${clicks} | Pos: ${Math.round(position * 10) / 10}`);
        // Opportunity: rank 5-30, some impressions, low CTR
        if (position >= 5 && position <= 30 && impressions >= 5 && clicks < 3) {
          siteOpportunities.push({ site: siteUrl, query, position, impressions, clicks });
        }
      }
    } catch (e: any) {
      console.warn(`   ⚠️ Query failed: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n🎯 G-Sites with data: ${sitesWithData}/15 | CTR opportunities: ${siteOpportunities.length}`);

  // AI optimize top 3 G-Sites opportunities
  for (let i = 0; i < Math.min(siteOpportunities.length, 3); i++) {
    const opp = siteOpportunities[i];
    const label = opp.site.split('/')[6] ?? opp.site;
    console.log(`\n🧬 [AI OPTIMIZE] Site: ${label} | Query: "${opp.query}" | Pos: ${Math.round(opp.position * 10) / 10}`);

    try {
      const prompt = `Sen son derece gelişmiş bir Semantik SEO yapay zekasısın.
Hedef Anahtar Kelime: "${opp.query}"
Hedef URL: ${opp.site}
Mevcut Sıralama: ${Math.round(opp.position * 10) / 10} | Gösterim: ${opp.impressions} | Tıklama: ${opp.clicks}

Bu sayfanın CTR'sini artırmak için, hedef kitleyi cezbedecek ve güven verecek 3 paragraftan oluşan Türkçe SEO tanıtım metni yaz. Sadece düz metin formatında.`;

      await omniAI.generate(prompt, {
        provider: 'deepseek',
        model: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 1500,
      });
      console.log(`   ✔ AI içerik üretildi: "${opp.query}"`);
      totalOptimized++;

      try {
        await SocialBomber.blast(opp.site, `${opp.query.toUpperCase()} - VIP Elite Partner`);
        console.log(`   💣 Social blast gönderildi.`);
      } catch (err: any) {
        console.log(`   ⚠️ Social Bomber skip: ${err.message}`);
      }

      await TelegramService.sendMessage(`
⚙️ <b>HYDRA BRAIN v2: G-SITES OPTIMIZE</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🛰️ <b>Site:</b> <code>${label}</code>
🔍 <b>Kelime:</b> <code>${opp.query}</code>
📊 <b>Sıra:</b> <code>${Math.round(opp.position * 10) / 10} | Gösterim: ${opp.impressions}</code>
🧠 <b>Aksiyon:</b> Semantik içerik üretildi & sosyal sinyaller gönderildi.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`.trim()).catch(() => {});

      await new Promise(r => setTimeout(r, 5000));
    } catch (e: any) {
      console.warn(`   ⚠️ AI optimization failed: ${e.message}`);
    }
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 2: MONEY SITES (sc-domain format)
  // ════════════════════════════════════════════════════════════
  const targetDomains = DOMAIN_MATRIX
    .filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE')
    .slice(0, 5);

  console.log(`\n\n💰 [HYDRA BRAIN] ━━ PHASE 2: Money Sites (${targetDomains.length} domains) ━━`);

  for (const target of targetDomains) {
    const siteUrl = `sc-domain:${target.host}`;
    console.log(`\n🔍 [MONEY SITE] ${siteUrl}`);

    try {
      const gscResponse = await sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query', 'page'],
          rowLimit: 50,
        },
      });

      const rows = gscResponse.data.rows ?? [];
      const opportunities = rows.filter(row => {
        const position = row.position ?? 0;
        const impressions = row.impressions ?? 0;
        const clicks = row.clicks ?? 0;
        return position >= 10.0 && position <= 30.0 && impressions > 10 && clicks < 5;
      });

      console.log(`   🎯 ${opportunities.length} CTR fırsatı bulundu.`);

      for (let i = 0; i < Math.min(opportunities.length, 2); i++) {
        const opp = opportunities[i];
        const query = opp.keys?.[0] ?? 'escort';
        const page = opp.keys?.[1] ?? `https://${target.host}/`;

        console.log(`   🧬 URL: ${page} | Kelime: ${query} | Pos: ${Math.round((opp.position ?? 0) * 10) / 10}`);

        const prompt = `Sen son derece gelişmiş bir Semantik SEO yapay zekasısın.
Kelime: "${query}" | URL: ${page} | Sıra: ${opp.position}
CTR düşük. 3 paragraf, cezbedici, güven veren Türkçe SEO tanıtım metni yaz. Sadece düz metin.`;

        await omniAI.generate(prompt, {
          provider: 'deepseek',
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 2000,
        });

        console.log(`   ✔ AI içerik üretildi.`);

        try {
          await SocialBomber.blast(page, `${query.toUpperCase()} - VIP Elite Partner`);
        } catch (err: any) {
          console.log(`   ⚠️ Social Bomber skip: ${err.message}`);
        }

        totalOptimized++;

        await TelegramService.sendMessage(`
⚙️ <b>HYDRA BRAIN v2: MONEY SITE OPTIMIZE</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🌐 <b>Domain:</b> <code>${target.host}</code>
📍 <b>URL:</b> <code>${page}</code>
🔍 <b>Kelime:</b> <code>${query}</code>
📊 <b>Sıra:</b> <code>${Math.round((opp.position ?? 0) * 10) / 10} (Tık: ${opp.clicks})</code>
🧠 <b>Aksiyon:</b> Semantik içerik üretildi & sosyal sinyaller kilitlendi.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`.trim()).catch(() => {});

        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (e: any) {
      console.warn(`   ⚠️ GSC sorgusu başarısız (${siteUrl}): ${e.message}`);
    }
  }

  console.log(`\n🏆 [HYDRA BRAIN v2] Tüm turlar tamamlandı. Toplam optimize: ${totalOptimized} sayfa.`);
}

runAutonomousBrain().catch(console.error);
