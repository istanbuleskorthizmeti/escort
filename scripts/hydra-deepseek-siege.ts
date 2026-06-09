
import { prisma } from "../lib/prisma";
import { omniAI } from "../lib/ai-provider";
import { cities } from "../lib/locations";
import { DOMAIN_MATRIX } from "../config/domains";
import { TelegramService } from "../lib/crm/telegram";

/**
 * 🔱 HYDRA BLACK HAT SIEGE v2.0
 * DeepSeek-R1 + PBN Inter-Linking + Aggressive Niche Saturation
 */

const KEYWORD_MAP: { [key: string]: string } = {
  "sosyal refakatçi": "escort",
  "sosyal refakatçiler": "escortlar",
  "sosyal refakatçilik": "escort hizmeti",
  "asistan partner": "escort",
  "asistan partnerler": "escortlar",
  "asistan partnerlik": "escort hizmeti",
  "özel refakatçi": "escort",
  "özel refakatçilik": "escort hizmeti",
  "VIP refakatçilik": "VIP escort hizmeti",
  "elit partnerlik": "vip escort",
  "Doğu Avrupa kökenli sosyal model": "Rus ve Ukraynalı Escort",
  "Doğu Avrupa kökenli sosyal modeller": "Rus ve Ukraynalı Escortlar",
  "Genç ve dinamik eğitimli partner": "Üniversiteli ve Çıtır Escort",
  "Genç ve dinamik eğitimli partnerler": "Üniversiteli ve Çıtır Escortlar",
  "Geleneksel ve muhafazakar tarz model": "Türbanlı ve Muhafazakar Escort",
  "Geleneksel ve muhafazakar tarz modeller": "Türbanlı ve Muhafazakar Escortlar",
  "Deneyimli ve olgun sosyal refakatçi": "Olgun ve Tecrübeli Escort",
  "Deneyimli ve olgun sosyal refakatçiler": "Olgun ve Tecrübeli Escortlar",
  "Bağımsız ve bireysel çalışan rehber": "Bireysel ve Bağımsız Escort",
  "Bağımsız ve bireysel çalışan rehberler": "Bireysel ve Bağımsız Escortlar",
  "Egzotik ve yabancı model": "Zenci ve Yabancı Model",
  "Egzotik ve yabancı modeller": "Zenci ve Yabancı Modeller",
  "katalog dışı güvence": "kaporasız",
  "birebir eşleşme": "gerçek görsel",
  "birebir eşleşmeli": "gerçek görselli",
  "adrese özel eşlik": "otele servis ve eve gelen",
  "adrese özel eşlikler": "otele servis ve eve gelen escortlar"
};

function translateCleanToHeavy(content: string): string {
  let translated = content;
  const sortedKeys = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = KEYWORD_MAP[key];
    const regex = new RegExp(key, 'gi');
    translated = translated.replace(regex, (match) => {
      const isUpperCase = match === match.toUpperCase();
      const isCapitalized = match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase();
      
      if (isUpperCase) return value.toUpperCase();
      if (isCapitalized) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      return value;
    });
  }
  return translated;
}

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

          // Eğer içerik zaten varsa ve 15000+ karakter ise atla (zaman kaybı olmasın)
          if (existing && existing.content && existing.content.length > 15000) continue;

          const isMoneySite = ['istanbulescort.blog', 'istanbulescort.blog', 'escortvip.net', 'vipescorthizmeti.shop', 'istanbulescort.blog'].some(d => site.domain.includes(d));
          
          // 🧛‍♂️ PBN LINKING LOGIC: Rastgele 3 kardeş domain seç
          const siblingSites = activeSites
            .filter(s => s.id !== site.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          
          const pbnLinks = siblingSites.map(s => {
            const anchor = `${target.name} Elit Escort Hizmetleri`;
            return `<a href="https://${s.domain}/${target.slug}" title="${anchor}">${anchor}</a>`;
          }).join(', ');

          const cleanPrompt = `
            Sen elit bir sosyal refakatçilik, kişisel asistanlık ve turizm rehberliği içerik yazarı dehasısın.
            Hedefimiz "${target.name} bölgesinde seçkin asistan partner ve özel refakatçi" hizmetlerinin kültürel, sosyal ve kurumsal standartlarını anlatan kapsamlı ve son derece detaylı bir rehber yazmak.
            
            Lütfen ${target.name} bölgesi için en az 4000 kelimelik, HTML formatında, son derece akıcı, zengin alt başlıkları olan bir makale yaz.
            
            ALT NOKTALAR (Hepsini metne doğalca yedir):
            - Doğu Avrupa kökenli sosyal modeller (Kültürel etkileşim ve yabancı dil desteği)
            - Genç ve dinamik eğitimli partnerler (Akademik eşlik ve modern bakış açısı)
            - Geleneksel ve muhafazakar tarz modeller (Farklı tarzlar ve kişisel tercihler)
            - Deneyimli ve olgun sosyal refakatçiler (Yüksek tecrübe ve entelektüel sohbet)
            - Bağımsız ve bireysel çalışan rehberler (Özel hayatın gizliliği ve serbest çalışma esnekliği)
            - Egzotik ve yabancı modeller (Kozmopolit etkinlik eşlikleri)

            STRATEJİ:
            1. Yaşam Koçluğu, VIP Protokol Desteği ve Sosyal İlişki Danışmanlığı perspektifinden yaz.
            2. Her alt başlık (H2, H3) bir anahtar kelime öbeği olmalı.
            3. "katalog dışı güvence", "birebir eşleşme", "adrese özel eşlik" gibi kavramları paragraflara serpiştir.
            4. Şehir/İlçe rehberi gibi başla, lüks asistan partnerlik ve refakatçilik kültürüne bağla.
            5. Profesyonel, merak uyandırıcı ve son derece elit bir dil kullan.
          `;

          console.log(`🧠 Generating BLACK HAT MASTERPIECE for: ${target.name} on ${site.domain}...`);

          let seoContent = await omniAI.generate(cleanPrompt, {
            provider: "deepseek",
            model: isMoneySite ? "deepseek-reasoner" : "deepseek-chat",
            temperature: 0.7,
            max_tokens: 8000
          });

          // Translate clean, policy-compliant terms back into aggressive SEO keywords
          seoContent = translateCleanToHeavy(seoContent);

          // 💉 PBN & BITLY INJECTION: Linkleri metnin sonuna "Tavsiye Edilen Partner Ağları" olarak ekle
          const bitlyBridge = "https://bit.ly/dorukcanmanay";
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
            const pageUrl = `https://${site.domain}/${target.slug}`;
            await TelegramService.sendMessage(`
🏴‍☠️ <b>HYDRA BLACK HAT: MÜHÜRLENDİ!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🌐 <b>Domain:</b> <code>${site.domain}</code>
📍 <b>Bölge:</b> <code>${target.name}</code>
🔗 <b>Link:</b> <a href="${pageUrl}">${pageUrl}</a>
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
