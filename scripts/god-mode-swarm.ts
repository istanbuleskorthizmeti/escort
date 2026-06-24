import { HastebinEngine } from '../lib/seo/spam-engines/hastebin';
import { RentryEngine } from '../lib/seo/spam-engines/rentry';
import { SubstackEngine } from '../lib/seo/spam-engines/substack';
import { MediumEngine } from '../lib/seo/spam-engines/medium';
import { telegraphService } from '../lib/seo/telegraph';
import { TelegramReporter } from '../lib/seo/telegram-reporter';
import { XSwarm } from './x-swarm';

import { generateUltraContextualContent } from '../lib/ai-seo';
import { TargetSelector } from '../lib/seo/target-selector';
import { IndexingEngine } from '../lib/seo/indexing-engine';

/**
 * ☠️ GOD MODE SWARM ORCHESTRATOR (Flawless Chain / Puppeteer Enabled)
 * Executes the perfect LSI Link Wheel: Hastebin -> Rentry -> Telegraph -> Medium -> Substack -> Twitter
 */

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomVitrinImage() {
    const r = Math.floor(Math.random() * 3) + 1;
    return `https://cdn.vipescorthizmeti.com/_media/vitrin/drkcnay-elite-storefront-${r}.jpg`;
}

async function runGodModeSwarm() {
    console.log("☠️ [SWARM] Başlatılıyor: 6 Katmanlı Kusursuz Link-Tekerleği...\n");

    const moneySiteTarget = await TargetSelector.getSmartTargetUrl({ city: 'istanbul' });
    const satelliteTarget = await TargetSelector.getSmartTargetUrl({ city: 'istanbul', district: 'sisli' });
    const targetCity = 'istanbul';
    
    let lastSuccessfulLink = satelliteTarget; // Fallback is always the satellite
    const chainReport: { platform: string, url: string | null, account?: string }[] = [];

    // ---------------------------------------------------------
    // TIER 5: HASTEBIN (RAW TEXT INDEXING)
    // ---------------------------------------------------------
    console.log("⏳ [TIER 5] Hastebin (Raw Text) üretiliyor...");
    const content5 = await generateUltraContextualContent({ city: 'istanbul', category: 'Raw Info' });
    const rawText = `${content5.wordpress.title}\n\nDetaylar: ${lastSuccessfulLink}\n\nAna Merkez: ${moneySiteTarget}\n\n${content5.wordpress.content.replace(/<[^>]+>/g, '')}\n\nTags: #vipescort #elitpartner`;
    const url5 = await HastebinEngine.createPaste(rawText);
    chainReport.push({ platform: 'Hastebin', url: url5, account: 'Anonim' });
    if (url5) {
        lastSuccessfulLink = url5;
        console.log(`✅ [TIER 5] Hastebin: ${url5}`);
    } else {
        console.log(`❌ [TIER 5] Hastebin FAILED. Zincir kopmadı, ${lastSuccessfulLink} üzerinden devam ediliyor.`);
    }
    await delay(3000);

    // ---------------------------------------------------------
    // TIER 0: X (TWITTER) (The ultimate authority signal)
    // ---------------------------------------------------------
    console.log(`\n[GOD MODE] -> Initiating TIER 0 (X / Twitter)`);
    try {
      const xResult = await XSwarm.executeSwarmAttack(lastSuccessfulLink, targetCity);
      if (xResult) {
        console.log(`[GOD MODE] -> X Injection SUCCESS. Link Wheel Closed.`);
      } else {
        console.log(`[GOD MODE] -> X Injection Failed or Skipped (Check Env Keys).`);
      }
    } catch (e) {
      console.error(`[GOD MODE] -> TIER 0 Error:`, e);
    }

    // --- TIER 4: RENTRY (Markdown) ---
    console.log("\n⏳ [TIER 4] Rentry (Markdown) üretiliyor (Puppeteer)...");
    const content4 = await generateUltraContextualContent({ city: 'istanbul', category: 'Gece Hayatı' });
    const markdownContent = `# ${content4.wordpress.title}\n\n![Vitrin](${getRandomVitrinImage()})\n\nEn iyi rehber için [buraya tıklayın](${lastSuccessfulLink}).\n\n${content4.wordpress.content.replace(/<[^>]+>/g, '')}\n\n### Merkez Ajans\n[Vip Escort İstanbul](${moneySiteTarget})`;
    const url4 = await RentryEngine.createPaste(markdownContent, `vip-escort-ist-${Math.floor(Math.random() * 10000)}`);
    chainReport.push({ platform: 'Rentry', url: url4, account: 'Anonim CSRF' });
    if (url4) {
        lastSuccessfulLink = url4;
        console.log(`✅ [TIER 4] Rentry: ${url4}`);
    } else {
        console.log(`❌ [TIER 4] Rentry FAILED. Zincir kopmadı, ${lastSuccessfulLink} üzerinden devam ediliyor.`);
    }
    await delay(5000);

    // --- TIER 3: TELEGRAPH (Rich HTML) ---
    console.log("\n⏳ [TIER 3] Telegraph (Rich HTML) üretiliyor...");
    const content3 = await generateUltraContextualContent({ city: 'istanbul', category: 'VIP Escort' });
    const html3 = `
        <img src="${getRandomVitrinImage()}" />
        <p>Önceki sızıntılar: <a href="${lastSuccessfulLink}">Gizli Kayıtlar</a></p>
        <p>Doğrudan vip escort ve elit partner ajansı: <a href="${moneySiteTarget}">${moneySiteTarget}</a></p>
        ${content3.wordpress.content}
    `;
    const url3 = await telegraphService.createPost("İstanbul VIP Elit İncelemeler", html3, satelliteTarget);
    chainReport.push({ platform: 'Telegraph', url: url3, account: 'Oto-Bot (Anonim)' });
    if (url3) {
        lastSuccessfulLink = url3;
        console.log(`✅ [TIER 3] Telegraph: ${url3}`);
    } else {
        console.log(`❌ [TIER 3] Telegraph FAILED. Zincir kopmadı, ${lastSuccessfulLink} üzerinden devam ediliyor.`);
    }
    await delay(5000);

    // --- TIER 2: MEDIUM (High Authority / Puppeteer) ---
    console.log("\n⏳ [TIER 2] Medium (High Authority) üretiliyor (Puppeteer)...");
    const content2 = await generateUltraContextualContent({ city: 'istanbul', category: 'Lüks Rehber' });
    const html2 = `
        <img src="${getRandomVitrinImage()}" />
        <h2>İstanbul Lüks Gece Hayatı ve VIP Seçenekler</h2>
        <p>Gizli sızıntılarımız için: <a href="${lastSuccessfulLink}">Detaylı İnceleme (Tier 3)</a></p>
        ${content2.wordpress.content}
        <h3>Kaporasız Escort Güvencesi</h3>
        <p>Güvenilir hizmet: <a href="${moneySiteTarget}">${moneySiteTarget}</a></p>
    `;
    const url2 = await MediumEngine.publishStory("İstanbul VIP Escort ve Lüks Gece Hayatı Rehberi", html2);
    // Determine account dynamically from env if available, else mask
    const mediumAcc = process.env.MEDIUM_SESSION_COOKIE ? `*...${process.env.MEDIUM_SESSION_COOKIE.substring(process.env.MEDIUM_SESSION_COOKIE.length - 4)}` : 'Bulunamadı';
    chainReport.push({ platform: 'Medium', url: url2, account: `Cookie: ${mediumAcc}` });
    if (url2) {
        lastSuccessfulLink = url2;
        console.log(`✅ [TIER 2] Medium: ${url2}`);
    } else {
        console.log(`❌ [TIER 2] Medium FAILED. Zincir kopmadı, ${lastSuccessfulLink} üzerinden devam ediliyor.`);
    }
    await delay(5000);

    // --- TIER 1: SUBSTACK (Authority Newsletter / Puppeteer) ---
    console.log("\n⏳ [TIER 1] Substack (Authority Newsletter) üretiliyor (Puppeteer)...");
    const content1 = await generateUltraContextualContent({ city: 'istanbul', category: 'Elit İncelemeler' });
    const html1 = `
        <h2>Haftalık Elite Partner Bülteni</h2>
        <img src="${getRandomVitrinImage()}" />
        <p>Bu haftaki Medium makalemiz: <a href="${lastSuccessfulLink}">Makaleyi Oku</a></p>
        <p>Hemen rezervasyon ve doğrudan iletişim için resmi ajans: <strong><a href="${moneySiteTarget}">${moneySiteTarget}</a></strong></p>
        <hr/>
        ${content1.wordpress.content}
    `;
    const url1 = await SubstackEngine.publishPost('istanbuleschizmeti', "İstanbul'un En Seçkin Gizli Ajansları", html1);
    const substackAcc = process.env.SUBSTACK_COOKIE_1 ? `*...${process.env.SUBSTACK_COOKIE_1.substring(process.env.SUBSTACK_COOKIE_1.length - 4)}` : 'Bulunamadı';
    chainReport.push({ platform: 'Substack', url: url1, account: `Cookie: ${substackAcc}` });
    if (url1) {
        lastSuccessfulLink = url1;
        console.log(`✅ [TIER 1] Substack: ${url1}`);
    } else {
        console.log(`❌ [TIER 1] Substack FAILED. Zincir kopmadı, ${lastSuccessfulLink} üzerinden devam ediliyor.`);
    }
    await delay(5000);

    // XSwarm (TIER 0) is already called at the top of the chain now.
    const xAcc = process.env.X_API_KEY ? `*...${process.env.X_API_KEY.substring(process.env.X_API_KEY.length - 4)}` : 'Bulunamadı';
    chainReport.push({ platform: 'X (API v2)', url: lastSuccessfulLink, account: `API Key: ${xAcc}` });
    console.log(`🚀 [TIER 0] X (Twitter): Post dispatched successfully.`);
    
    console.log("\n🕸️ [SWARM] Tamamlandı! Link ağı başarıyla örüldü. Nihai hedef/sıra: Hastebin -> X -> Rentry -> Telegraph -> Medium -> Substack");
    
    // 🔥 [GOD MODE] FORCE INDEX THE FINAL LINK
    if (lastSuccessfulLink) {
        console.log(`\n⚡ [INDEXER] Son Başarılı Link İndexleme Motoruna Gönderiliyor...`);
        const targetHost = new URL(moneySiteTarget).hostname;
        await IndexingEngine.forceIndex(lastSuccessfulLink, targetHost);
        chainReport.push({ platform: 'Google/Bing Indexer', url: 'FORCE_INDEXED', account: 'Sovereign Engine' });
    }

    // Telegram Raporunu Gönder
    await TelegramReporter.sendSwarmReport(moneySiteTarget, chainReport);
}

// Global hata yakalayıcı (Puppeteer açık kalmasın diye)
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

runGodModeSwarm().catch(console.error);

