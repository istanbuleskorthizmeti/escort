import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { DOMAIN_MATRIX } from '../../config/domains';

import { omniAI } from '../../lib/ai-provider';

const prisma = new PrismaClient();

async function generateUniqueContent(domain: string, district: string, city: string, theme: string, retryCount = 0): Promise<any> {
    const prompt = `Sen bir kıdemli Black Hat SEO ve agresif Copywriter uzmansın.
    Görev: "${domain}" alan adı için arama motoru botlarını semantik olarak manipüle edecek, %100 özgün, TF-IDF yoğunluklu ve hiddetli bir ana sayfa metni yazmak.
    Lokasyon: ${district || city} / İstanbul.
    Anahtar Kelimeler ve LSI terimleri: escort, escort bayan, rus escort, üniversiteli escort, kaporasız escort, VIP transfer escort, eve gelen model escort, otele servis escort.
    Kurallar:
    1. Kesinlikle "escort" anahtar kelimeleri ve nişleri (Rus, Üniversiteli, Kaporasız) metin içerisinde doğal ama %3.5-%4.5 TF-IDF yoğunlukla geçmelidir.
    2. Metin en az 650 kelime olmalı, yapılandırılmış alt başlıklar (H2, H3) ve zengin HTML etiketleri barındırmalıdır.
    3. Başlık (Title - max 60 karakter) ve Meta Açıklama (Description - max 155 karakter) da üretmelisin.
    4. Format JSON olmalı: { "title": "...", "description": "...", "content": "..." }
    5. Konuma özel dil kullan: Beşiktaş/Şişli için lüks ve premium, Esenyurt/Bağcılar için çıtır ve samimi bir üslup kullan.
    6. "DRKCNAY ELITE" markasını ana otorite olarak vurgula.
    7. KRİTİK: Başlıklarda kelime aralarına asla boş gereksiz karakterler veya tire (-) koyma. "Şişli Escort" şeklinde yaz.
    8. İçerik içinde en az 2 adet anchor text barındıran link kullan:
       - <a href="https://vipescorthizmeti.com">${district || city} VIP Escort</a>
       - <a href="https://bit.ly/dorukcanmanay">Kaporasız Escort Vitrini</a>`;

    const systemPrompt = `
      Sen dünyanın en iyi Black Hat SEO ve Copywriting uzmanısın.
      Arama motoru botlarını (Google SGE dahil) semantik manipülasyonla ele geçirmek üzere "${domain}" için %100 özgün, hiddetli ve ikna edici bir ana sayfa metni yazmalısın.
      LOKASYON: ${district || city}.
      MARKA: DRKCNAY ELITE.
      ODAK: Escort, Rus Escort, VIP Transfer Escort, Kaporasız Escort, Otele Servis.
      KELİME SINIRI: ~700 kelime.
      FORMAT: SADECE GEÇERLİ JSON.
    `;

    try {
        const response = await omniAI.generate(prompt, { systemPrompt, temperature: 0.85, max_tokens: 4000 });
        let jsonStr = response.trim();
        if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
        return JSON.parse(jsonStr);
    } catch (e: any) {
        console.error(`❌ [DNA-FORGE] AI Error for ${domain}:`, e.message);
        return {
            title: `${district || city} VIP Escort | %100 Gerçek ve Kaporasız | DRKCNAY`,
            content: `Hoş geldiniz. ${district || city} bölgesinde en iyi escort deneyimi için buradasınız. %100 gerçek ve kaporasız modellerimizle hizmetinizdeyiz.`
        };
    }
}

async function forgeDNA() {
    console.log('🧬 [DNA-FORGE] Starting Unique Content Generation for 56 domains...');

    for (const domain of DOMAIN_MATRIX) {
        console.log(`📡 [PROCESSING] ${domain.host}...`);
        
        // 1. Ensure Site exists
        const site = await prisma.site.upsert({
            where: { domain: domain.host },
            update: { status: 'ACTIVE' },
            create: { domain: domain.host, status: 'ACTIVE', healthScore: 100 }
        });

        // 2. Skip if already forged
        const existing = await prisma.pageContent.findUnique({
            where: { slug_siteId: { slug: 'home', siteId: site.id } }
        });

        if (existing && existing.content && existing.content.length > 500) {
            console.log(`⏩ [SKIPPING] ${domain.host} already forged.`);
            continue;
        }

        // 3. Generate Unique DNA
        const dna = await generateUniqueContent(
            domain.host, 
            domain.targetDistrict || '', 
            domain.targetCity || 'İstanbul', 
            domain.theme
        );

        // 4. Persist to DB
        await prisma.pageContent.upsert({
            where: { 
                slug_siteId: { 
                    slug: 'home', 
                    siteId: site.id 
                } 
            },
            update: {
                title: dna.title,
                content: dna.content
            },
            create: {
                slug: 'home',
                site: { connect: { id: site.id } },
                title: dna.title,
                content: dna.content
            }
        });

        console.log(`✅ [DNA-FORGED] ${domain.host} is now unique.`);
        
        // 🕒 [RATE LIMIT PROTECTION]
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('🏁 [DNA-FORGE COMPLETE] All 56 domains have unique DNA.');
}

forgeDNA().catch(console.error).finally(() => prisma.$disconnect());
