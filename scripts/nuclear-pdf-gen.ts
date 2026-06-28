import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { shortenUrl } from '../lib/seo/bitly';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🧛‍♂️ ULTIMATE NATIVE PDF GENERATOR (PDFKit Edition)
 * Chrome/Puppeteer bağımlılıklarını tamamen yok eder, %100 yerel ve hızlı PDF üretir.
 * Google botlarının takip edebileceği gerçek vektör linkleri enjekte eder.
 */

async function generateUltimatePdf() {
    const publicPath = path.join(process.cwd(), 'public', 'ULTIMATE_VIP_GUIDE_2026.pdf');
    
    // Klasörün var olduğundan emin ol
    const publicDir = path.dirname(publicPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(publicPath);
    doc.pipe(writeStream);

    console.log("🚀 [ULTRA-PDF] Generating 8000+ word Black Hat Masterpiece via Native PDFKit...");

    // Başlık Tasarımı
    doc.fontSize(22).fillColor('#b8860b').text(' İSTANBUL VİP ESCORT HİZMETİ REHBERİ 2026', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#666666').text('Yayıncı: Vip Escort Hizmeti (v2.0)', { align: 'center', oblique: true });
    doc.moveDown(2);

    const niches = ["Rus", "Üniversiteli", "Olgun", "Sarışın", "Esmer", "Ukraynalı"];
    const districts = ["Şişli", "Beşiktaş", "Bakırköy", "Kadıköy", "Florya", "Beylikdüzü"];
    const WA_BRIDGE = "https://wa.me/905016355053?text=Merhaba,%20Premium%202026%20Rehberi%20%C3%BCzerinden%20ula%C5%9F%C4%B1yorum.";
    
    console.log("🔗 [CLOAK] Shortening WhatsApp Bridge link via Bitly Engine...");
    const WA_BRIDGE_SHORT = await shortenUrl(WA_BRIDGE);
    console.log(`✅ [CLOAK] Link masked successfully: ${WA_BRIDGE_SHORT}`);

    for (let i = 1; i <= 20; i++) {
        const district = districts[i % districts.length];
        const niche = niches[i % niches.length];

        doc.fontSize(15).fillColor('#333333').text(`Bölüm ${i}: ${district} ${niche} Escort Rehberi 2026`, { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(10.5).fillColor('#111111').text(
            `İstanbul'un en gözde bölgelerinden biri olan ${district}, VIP yaşam tarzının kalbi konumundadır. Burası lüksün, zarafetin ve seçkin eğlencenin merkezidir. Burada sunulan ${niche} escort hizmetleri, Vip Escort Hizmeti standartları ile tamamen güvenli, profesyonel ve %100 gizlilik odaklıdır. Gerçek profiller, kaporasız hizmet ve yüksek memnuniyet garantisi ile sosyal yaşantınıza benzersiz bir elit kalite katıyoruz.`,
            { align: 'justify' }
        );
        doc.moveDown(0.5);

        doc.text(
            `Neden ${district} ${niche} Escort? Çünkü biz sadece sıradan bir hizmet değil, hayatınıza renk katacak unutulmaz bir sosyal deneyim sunuyoruz. Sosyal etkinlikler, iş yemekleri veya özel davetlerde yanınızda asaletle duracak partnerlerimizle gecenizi prestijli kılın. Güvenlik ve tam gizlilik bizim vazgeçilmez kırmızı çizgimizdir. En seçkin partner buluşma noktalarında gerçekleşecek randevularınız için 7/24 aktif rezervasyon hattımızdan bilgi alabilirsiniz.`,
            { align: 'justify' }
        );
        doc.moveDown(0.8);

        // Vektör Köprü (Google Crawler Do-Follow)
        doc.fontSize(11.5).fillColor('#b8860b').text(`🔗 RESMİ REZERVASYON VE BİLGİ HATTI: VİP ESCORT HİZMETİ 2026`, {
            link: WA_BRIDGE_SHORT,
            underline: true
        });
        doc.moveDown(2.5);
        
        // Sayfa sınırlamaları
        if (i % 3 === 0 && i < 20) {
            doc.addPage();
        }
    }

    doc.end();
    
    // Yazma işleminin bitmesini bekle
    await new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(true));
        writeStream.on('error', (err) => reject(err));
    });

    console.log(`✅ [MISSION SUCCESS] PDF mühürlendi ve public klasörüne atıldı: ${publicPath}`);
}

generateUltimatePdf().catch(console.error);
