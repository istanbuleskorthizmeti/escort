require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function createBitlyLink(longUrl) {
    const BITLY_TOKEN = process.env.BITLY_ACCESS_TOKEN;
    if (!BITLY_TOKEN) {
        console.error("❌ BITLY_ACCESS_TOKEN .env dosyasında bulunamadı.");
        return null;
    }

    try {
        const response = await axios.post(
            'https://api-ssl.bitly.com/v4/shorten',
            { long_url: longUrl, domain: "bit.ly" },
            {
                headers: {
                    'Authorization': `Bearer ${BITLY_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.link;
    } catch (error) {
        console.error(`❌ Bitly API Hatası (${longUrl}):`, error.response?.data?.description || error.message);
        return null;
    }
}

async function main() {
    // 🎯 Yeni ana alan adımız
    const NEW_DOMAIN = 'istanbulescort.blog';
    const baseUrl = `https://${NEW_DOMAIN}`;

    // 🎯 Backlink (Parazit) bombası için oluşturulacak stratejik sayfalar
    const targetPages = [
        baseUrl, // Ana sayfa
        `${baseUrl}/istanbul`,
        `${baseUrl}/istanbul/sisli`,
        `${baseUrl}/istanbul/kadikoy`,
        `${baseUrl}/istanbul/besiktas`,
        `${baseUrl}/istanbul/beylikduzu`,
        `${baseUrl}/kategori/rus-escort`,
        `${baseUrl}/kategori/vip-escort`
    ];

    console.log(`🚀 [GOD MODE] ${NEW_DOMAIN} için Bitly Backlink Üretimi Başlıyor...`);

    for (const url of targetPages) {
        // Benzersiz slug oluştur (örneğin: istanbulescdrkcn_com_istanbul_sisli)
        const slug = url.replace('https://', '').replace(/\//g, '_').replace(/\./g, '_');
        const settingKey = 'shortlink_' + slug;

        // DB'de var mı kontrol et
        const existing = await prisma.systemSetting.findUnique({
            where: { key: settingKey }
        });

        if (!existing) {
            console.log(`⏳ ${url} için Bitly linki üretiliyor...`);
            const shortUrl = await createBitlyLink(url);

            if (shortUrl) {
                console.log(`✅ Başarılı: ${shortUrl}`);
                // Veritabanına kaydet (Tier 2/3 Backlink botları buradan okuyup basacak)
                await prisma.systemSetting.create({
                    data: {
                        key: settingKey,
                        value: shortUrl
                    }
                });
                console.log(`💾 Veritabanına kaydedildi: ${settingKey}`);
            }
            
            // Rate limit (API limiti) yememek için 2 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            console.log(`⏭️ Atlandı: ${url} için zaten link var -> ${existing.value}`);
        }
    }
    
    console.log("🔥 [BİTTİ] Tüm stratejik linkler üretildi ve veritabanına kaydedildi.");
    await prisma.$disconnect();
}

main().catch(console.error);
