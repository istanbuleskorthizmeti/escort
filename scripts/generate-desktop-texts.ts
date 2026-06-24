import fs from 'fs';
import path from 'path';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

function generateArticleText(district: string, neighbors: string[]): string {
    const currentYear = new Date().getFullYear();
    const cleanNeighbors = neighbors.slice(0, 10).join(', ');
    return `${district} Escort Hizmeti - VIP ve Kaporasız Partnerler ${currentYear}\n\n` +
           `${district} genelinde kaporasız, ön ödemesiz ve tamamen adreste elden ödemeli çalışan bireysel escort partnerlerin güncel listesine ulaşmak için doğru yerdesiniz. ` +
           `Tamamı teyitli ve gerçek görsellerden oluşan elit refakatçi alternatiflerimiz, siz değerli misafirlerimize unutulmaz anlar yaşatmak için hazırdır. ` +
           `${district} escort bayan seçenekleri arasından dilediğiniz profili tercih ederek doğrudan iletişime geçebilir, güvenli randevunuzu hemen oluşturabilirsiniz.\n\n` +
           `Neden Bizim VIP Partnerlerimiz?\n` +
           `- %100 Gerçek Görsel Garantisi: Görsellerin tamamı canlı video veya teyit süreçlerinden geçmiş gerçek kişilere aittir.\n` +
           `- Kaporasız ve Güvenli Hizmet: Ön ödeme yapmadan, kapora dolandırıcılarına bulaşmadan, buluşmada adreste nakit ödeme yapabilirsiniz.\n` +
           `- Lüks Rezidans & 5 Yıldızlı Otel Servisi: Belirttiğiniz adrese veya otele en kısa sürede ulaşım sağlanır.\n\n` +
           `Hizmet Bölgeleri ve Semtler:\n` +
           `Bağımsız partnerlerimizin aktif olarak hizmet verdiği bölgeler: ${district} ve yakın çevresindeki ${cleanNeighbors} semtleri.\n\n` +
           `Anahtar Kelimeler:\n` +
           `${district} escort, ${district} eskort, kaporasız ${district} escort, ${district} üniversiteli eskort, ${district} rus escort, ${district} vip eskort.`;
}

async function main() {
    console.log("🚀 Generating SEO articles for all districts...");
    const desktopPath = path.join('C:', 'Users', 'onurk', 'Desktop', 'google-sites-seo-texts.txt');
    
    let content = "========================================================================\n";
    content += "        GOOGLE SITES NATIVE SEO ARTICLES - GENERATED FOR ALL DISTRICTS\n";
    content += "========================================================================\n\n";

    for (const [districtSlug, neighbors] of Object.entries(ISTANBUL_NEIGHBORS)) {
        const districtName = districtSlug.charAt(0).toUpperCase() + districtSlug.slice(1);
        const article = generateArticleText(districtName, neighbors);
        
        content += `------------------------------------------------------------------------\n`;
        content += `🎯 BÖLGE: ${districtName.toUpperCase()}\n`;
        content += `------------------------------------------------------------------------\n\n`;
        content += article + "\n\n\n";
    }

    try {
        fs.writeFileSync(desktopPath, content, 'utf8');
        console.log(`✅ SEO articles successfully generated and saved to: ${desktopPath}`);
    } catch (err: any) {
        console.error("❌ Failed to write file to desktop:", err.message);
    }
}

main();
