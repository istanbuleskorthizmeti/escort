
import { prisma } from "../lib/prisma";
import { omniAI } from "../lib/ai-provider";
import { cities } from "../lib/locations";
import { DOMAIN_MATRIX } from "../config/domains";
import { TelegramService } from "../lib/crm/telegram";

/**
 * 🔱 HYDRA BLACK HAT SIEGE v2.0
 * DeepSeek-R1 + PBN Inter-Linking + Aggressive Niche Saturation
 */

async function startSiege() {
  console.log("🚀 [GOD MODE] Hydra Black Hat Siege v2.0 Activated...");
  
  const activeSites = await prisma.site.findMany({ where: { status: "ACTIVE" } });
  
  let totalCreated = 0;

  for (const site of activeSites) {
    const config = DOMAIN_MATRIX.find(d => site.domain.includes(d.host));
    const targetCityKeys = config?.targetCity ? [config.targetCity.toLowerCase()] : ["istanbul"];

    for (const cityKey of targetCityKeys) {
      const city = cities[cityKey];
      if (!city) continue;

      const targets = [
        { name: city.name, slug: city.slug, type: "CITY" },
        ...city.districts.map(d => ({ name: d.name, slug: `${city.slug}/${d.slug}`, type: "DISTRICT" }))
      ];

      for (const target of targets) {
        try {
          const existing = await prisma.pageContent.findUnique({
            where: { slug_siteId: { slug: target.slug, siteId: site.id } }
          });

          // Eğer içerik zaten varsa ve 4000+ kelime ise atla (zaman kaybı olmasın)
          if (existing && existing.content && existing.content.length > 15000) continue;

          const isMoneySite = site.domain.includes('vipescorthizmeti.com');
          
          // 🧛‍♂️ PBN LINKING LOGIC: Rastgele 3 kardeş domain seç
          const siblingSites = activeSites
            .filter(s => s.id !== site.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          
          const pbnLinks = siblingSites.map(s => {
            const anchor = `${target.name} Elit Escort Hizmetleri`;
            return `<a href="https://${s.domain}/${target.slug}" title="${anchor}">${anchor}</a>`;
          }).join(', ');

          const blackHatPrompt = `
            Sen bir Black Hat SEO dehasısın. Hedefimiz "${target.name} escort" anahtar kelimesi ve tüm yan nişlerde Google'da 1. sırayı ALMAK.
            
            Lütfen ${target.name} bölgesi için 6000+ kelimelik, HTML formatında, agrasif semantik (LSI) içeren bir makale yaz.
            
            KRİTİK NİŞLER (Hepsini metne doğalca yedir):
            - Rus ve Ukraynalı Escortlar (Lüks odaklı)
            - Üniversiteli ve Çıtır Escortlar (Gençlik odaklı)
            - Türbanlı ve Muhafazakar Escortlar (Fantezi odaklı)
            - Olgun ve Tecrübeli Escortlar (Milf odaklı)
            - Bireysel ve Bağımsız Escortlar (Gizlilik odaklı)
            - Zenci ve Yabancı Modeller (Egzotik odaklı)

            STRATEJİ:
            1. Yaşam Koçluğu ve İlişki Danışmanlığı maskesini kullan ama escort kelimesini ve nişleri cerrahi bir hassasiyetle metne göm.
            2. Her alt başlık (H2, H3) bir anahtar kelime öbeği olmalı.
            3. "Kaporasız", "Gerçek Görsel", "Otele Servis", "Eve Gelen" gibi güven tetikleyicilerini her paragrafta kullan.
            4. Şehir/İlçe rehberi gibi başla, VIP partnerlik kültürüne bağla.

            SONUÇ: Google botu bu metni okuduğunda "Burası sektörün kütüphanesi" demeli.
          `;

          console.log(`🧠 Generating BLACK HAT MASTERPIECE for: ${target.name} on ${site.domain}...`);

          let seoContent = await omniAI.generate(blackHatPrompt, {
            provider: "deepseek",
            model: isMoneySite ? "deepseek-reasoner" : "deepseek-chat",
            temperature: 0.7,
            max_tokens: 8000
          });

          // 💉 PBN & BITLY INJECTION: Linkleri metnin sonuna "Tavsiye Edilen Partner Ağları" olarak ekle
          const bitlyBridge = "https://bit.ly/istanbulescort2026";
          seoContent += `
            <div style="margin-top: 50px; padding: 20px; border: 1px solid #222; font-size: 11px; color: #444;">
              <h3>🔱 NETWORK ÖNERİLERİ & DOĞRULANMIŞ REHBER</h3>
              <p>Hızlı ve güvenli erişim için resmi kısa linkimiz: <a href="${bitlyBridge}" style="color: #e11d48; font-weight: bold;">${bitlyBridge}</a></p>
              <p>${target.name} bölgesindeki diğer elit partner ağlarımıza göz atın: ${pbnLinks}</p>
            </div>
          `;

          await prisma.pageContent.upsert({
            where: { slug_siteId: { slug: target.slug, siteId: site.id } },
            create: { siteId: site.id, slug: target.slug, title: `🔞 ${target.name.toUpperCase()} ESCORT | VIP PARTNER & YAŞAM KOÇLUĞU`, content: seoContent },
            update: { content: seoContent, updatedAt: new Date() }
          });

          totalCreated++;
          
          if (totalCreated % 1 === 0) {
            await TelegramService.sendMessage(`
🏴‍☠️ <b>HYDRA BLACK HAT: MÜHÜRLENDİ!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🌐 <b>Domain:</b> <code>${site.domain}</code>
📍 <b>Bölge:</b> <code>${target.name}</code>
🧪 <b>Nişler:</b> Rus, Çıtır, Türbanlı, Olgun (Tümü)
🔗 <b>PBN Bağlantısı:</b> 3 Kardeş Siteye Link Verildi
🧠 <b>Model:</b> DeepSeek R1/V3 Aggressive
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>SERP Dominasyonu Başlatıldı...</i>
            `.trim());
          }

          await new Promise(r => setTimeout(r, 8000));

        } catch (err: any) {
          console.error(`❌ Error:`, err.message);
          await new Promise(r => setTimeout(r, 15000));
        }
      }
    }
  }
}

startSiege().catch(console.error);
