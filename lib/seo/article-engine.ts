/**
 * ⚡ DRKCNAY ESCORT ARTICLE ENGINE (TOTAL WAR MODE)
 * Generates high-octane, keyword-aggressive escort articles for 24 domains.
 */

export function generateAggressiveEscortArticle(city: string, district: string) {
  const loc = `${city} ${district}`.trim();
  const upperLoc = loc.toUpperCase();

  const titles = [
    `${upperLoc} ESCORT | ${upperLoc} ESCORT BAYAN | ${upperLoc} VIP ESCORT`,
    `${upperLoc} ESCORT | %100 GERÇEK ${upperLoc} ESCORTLAR | ${upperLoc} ESCORT`,
    `${upperLoc} ESCORT BAYAN | ${upperLoc} ESCORT | ${upperLoc} ESCORT NUMARALARI`,
    `${upperLoc} VIP ESCORT | ${upperLoc} ESCORT | ${upperLoc} ESCORT BAYAN`
  ];

  const content = `
    <div style="background: #0a0a0a; border: 1px solid #3f3f46; border-radius: 20px; padding: 40px; margin: 30px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <h2 style="color: #ff8600; font-size: 28px; text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid #ff8600; padding-bottom: 10px;">DRKCNAY Elite: ${upperLoc} Özel Refakat Hizmetleri</h2>
      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
        Günün karmaşasından ve yoğun iş temposundan uzaklaşmak isteyen elit beyefendiler için, <b>${loc}</b> bölgesindeki en seçkin ve vizyoner hanımefendilerle tanışma fırsatı sunuyoruz. DRKCNAY Elite portföyü, yalnızca güzelliğiyle değil, kültürel birikimi ve zarafetiyle de öne çıkan özel profillerden oluşur. ${city} elit yaşam tarzının gereksinimlerini tam olarak karşılayan partnerlerimizle, standartların ötesinde bir deneyime hazır olun.
      </p>
      
      <h3 style="color: #fff; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Gizlilik ve Güvenlik Odaklı Deneyim Standartları</h3>
      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
        <b>${loc}</b> otele ve eve gelen özel refakat hizmetlerimizde, <strong>Kaporasız İşlem</strong> prensibimizle %100 güvenli bir altyapı sunmaktayız. Gerçek görseller, teyitli profiller ve üst düzey gizlilik standartlarımizle, vaktinizi riske atmadan doğrudan kaliteye ulaşırsınız. Sektördeki en yaygın sorun olan ön ödeme taleplerini tamamen ortadan kaldırıyor, güvene dayalı elit bir ağ oluşturuyoruz.
      </p>

      <h3 style="color: #fff; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Neden ${upperLoc} Bölgesinde Bizi Seçmelisiniz?</h3>
      <ul style="color: #a1a1aa; font-size: 16px; line-height: 1.8; margin-bottom: 20px; list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">✓ <strong>Gerçek Görseller:</strong> Katalogdaki tüm profil fotoğrafları %100 güncel ve doğrulanmıştır. Karşılaşacağınız kişi ile ekranda gördüğünüz kişi aynıdır.</li>
        <li style="margin-bottom: 10px;">✓ <strong>7/24 VIP Hizmet:</strong> ${loc} bölgesindeki lüks oteller ve rezidanslar için zaman sınırlaması olmaksızın, en kısa sürede özel araçlarla transfer sağlanır.</li>
        <li style="margin-bottom: 10px;">✓ <strong>Elit Profil Ağı:</strong> Sadece elit müşterilere hitap eden, üniversiteli, rus veya model standartlarında özel eğitimli partnerler.</li>
        <li style="margin-bottom: 10px;">✓ <strong>%100 Gizlilik:</strong> Hiçbir kişisel bilginiz sistemlerimizde tutulmaz, tüm görüşmeler uçtan uca şifreli Telegram ve WhatsApp hatları üzerinden yapılır.</li>
      </ul>

      <h3 style="color: #fff; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">${loc} Gece Hayatı ve Lüks Eşlik Kavramı</h3>
      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
        ${city} gibi kozmopolit bir şehirde, özellikle <b>${loc}</b> gibi seçkin noktalarda, kaliteli zaman geçirmek bir lüksten ziyade ihtiyaçtır. İş seyahatlerinizde, özel davetlerinizde veya sadece şehrin stresini atmak istediğiniz özel anlarınızda, size eşlik edecek partnerin vizyonu, diksiyonu ve duruşu büyük önem taşır. Sadece yatak odası sınırlarına hapsolmayan, aynı zamanda lüks bir restoranda size eşlik edebilecek kalibrede hanımefendilerle çalışıyoruz.
      </p>
      
      <p style="color: #ff8600; font-weight: bold; font-style: italic; margin-top: 30px; font-size: 18px; text-align: center; border: 1px solid #ff8600; padding: 15px; border-radius: 10px;">
        Zamanınızın değerini biliyoruz. En iyisini hak ediyorsunuz. ${loc} VIP Escort Standartları ile tanışmak için hemen bizimle iletişime geçin.
      </p>
    </div>
  `;

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    content: content.trim()
  };
}
