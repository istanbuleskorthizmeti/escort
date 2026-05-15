import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * DRKCNAY ELITE: PDF Backlink Engine
 * Automatically generates SEO-optimized, highly-structured PDF brochures
 * containing dynamic keyword injection and Bit.ly routing links.
 */
export class PDFGenerator {
  static async generate(data: {
    city: string;
    district: string;
    niche: string;
    content: string;
    targetUrl: string;
    filename: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `VIP ${data.city} ${data.district} ${data.niche} Rehberi 2026`,
            Author: 'DRKCNAY ELITE PROTOCOL',
            Subject: `${data.city} ${data.district} bölgesinde kurumsal VIP escort hizmetleri.`,
            Keywords: `${data.city} escort, ${data.district} escort, elit escort, kaporasız, vip escort, ${data.niche}`
          }
        });

        // Ensure output directory exists
        const outDir = path.join(process.cwd(), 'generated_pdfs');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        
        const outputPath = path.join(outDir, `${data.filename}.pdf`);
        const writeStream = fs.createWriteStream(outputPath);
        
        doc.pipe(writeStream);

        // Header Background
        doc.rect(0, 0, doc.page.width, 120).fill('#0a0a0a');
        
        // Brand Title
        doc.fillColor('#e11d48')
           .fontSize(32)
           .text('DRKCNAY ELITE 2026', 50, 40, { align: 'center', underline: false });
           
        // Subtitle / Location
        doc.fillColor('#cccccc')
           .fontSize(16)
           .text(`Lüks ${data.city} ${data.district} ${data.niche} Seçkisi`, { align: 'center' });

        doc.moveDown(4);

        // Main Content (AI Spintext)
        doc.fillColor('#333333')
           .fontSize(12)
           .lineGap(6)
           .text(data.content.replace(/<[^>]+>/g, ''), { align: 'justify' }); // Strip HTML tags just in case

        doc.moveDown(2);

        // SEO Injection & Clickable Routing
        const boxTop = doc.y;
        doc.rect(50, boxTop, doc.page.width - 100, 80).fill('#fff1f2').stroke('#e11d48');
        
        doc.fillColor('#be123c')
           .fontSize(14)
           .text('Hemen İncele & Güvenli Rezervasyon Yap:', 50, boxTop + 20, { align: 'center' });

        // Add the actual clickable backlink anchor
        doc.fillColor('#1d4ed8')
           .fontSize(16)
           .text(`🔥 ${data.city} ${data.district} VIP Escort İlanlarıı İçin Tıklayın`, 50, boxTop + 45, { 
             align: 'center', 
             link: data.targetUrl,
             underline: true
           });

        // Footer
        doc.fillColor('#999999')
           .fontSize(10)
           .text(`Bu döküman otonom olarak üretilmiştir. Tüm hakları saklıdır. © 2026 DRKCNAY Elite Network`, 
             50, doc.page.height - 50, { align: 'center' }
           );

        doc.end();

        writeStream.on('finish', () => resolve(outputPath));
        writeStream.on('error', (err) => reject(err));

      } catch (err) {
        reject(err);
      }
    });
  }
}
