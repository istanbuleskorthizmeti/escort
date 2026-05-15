import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/UI/Navbar';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Elit Ansiklopedi | Escortvip Premium Lügat 2026',
  description: 'Türkiye\'nin elit escort ve vip partner sektörüne yön veren "Elit" prensipleri, gizlilik terimleri ve üst düzey hizmet lügatı.',
};

type EncyclopediaTerm = {
  term: string;
  definition: string;
  deepLink?: string;
};

const terms: EncyclopediaTerm[] = [
  {
    term: "Tam Gizlilik (Sıfır-İz)",
    definition: "Dijital veya fiziksel hiçbir ayak izi bırakmadan sürecin baştan sona kapalı devre iletişim (WhatsApp/Telegram kripto modları) üzerinden yürütülüp sonlandırılması. İş dünyasından isimler için en kritik kuraldır.",
  },
  {
    term: "VIP Yaşam",
    definition: "Müşterinin sadece talep eden değil, tamamen egemen (Elit) ve her detayın onun etrafında şekillendiği kontrol modunda olduğu bir hizmet skalası.",
  },
  {
    term: "Kaporasız Standart",
    definition: "Escortvip'nin temel güven ilkesi. Hiçbir ajans, üye veya escort, görüşme yüz yüze başlamadan banka havalesi veya kapora talep edemez.",
  },
  {
    term: "Predictive Service (Öngörülü Hizmet)",
    definition: "Siz daha talep etmeden, odanın ışıklandırmasından içeceğe kadar atmosferin sizin psikolojik/fiziksel verilerinize göre hazır edilmesi durumu.",
  },
  {
    term: "Elit",
    definition: "Tam egemenlik. Bireyin dış dünyadan soyutlanıp, sadece lüks ve hazza hükmettiği zaman aralığına verilen teknik isim.",
  },
  {
    term: "Yakınlık Simyası",
    definition: "VIP partner ile müşteri arasında fiziksel temasın çok ötesinde yer alan 'zihinsel ve ruhsal senkronizasyon' durumu. Eda Nur tarafından sektöre kazandırılmıştır.",
  },
  {
    term: "GFE (Girlfriend Experience)",
    definition: "Randevunun yalnızca fiziksel bir birleşmeden ibaret olmadığı; sohbet, şefkat, restoranda yemek gibi 'gerçek sevgili' dinamiklerini barındıran üst düzey konsept.",
    deepLink: "/ansiklopedi/iliski-simyasi"
  },
  {
    term: "CIM / COB (Tabu standartları)",
    definition: "Yetişkin sektöründeki ileri seviye yakınlık jargonları. Escortvip'nin 'Limitsiz Fantezi' ve anal kraliçeleri kategorilerinde sıkça rastlanan, yüksek kimya gerektiren eylemler.",
  },
  {
    term: "BDSM & Dominatrix",
    definition: "Bağlama, disiplin, tahakküm ve itaat sınırlarının güvenli kelimeler (safe word) eşliğinde test edildiği; iş hayatında çok yorulan 'Alfa' erkeklerin kontrolü devrettiği psikolojik rahatlama yöntemi.",
    deepLink: "/ansiklopedi/fantezi-arkeolojisi"
  },
  {
    term: "Incall / Outcall",
    definition: "Incall, misafirin partnerin kendi VIP rezidansına veya oteline gitmesidir. Outcall, partnerin misafirin bulunduğu lüks lokasyona veya yata transfere özel şoförle gelmesidir.",
  },
  {
    term: "Prestij Class",
    definition: "Dr. DRKCNAY tarafından tescillenen, hem estetik hem de entelektüel olarak (yabancı dil, görgü kuralları) diplomatik seviyedeki escort sınıfı.",
  },
  {
    term: "French / Greek (Egzotik Disiplinler)",
    definition: "Fransız ve Yunan ekolü yakınlaşma tarzı. Partnerin dudaklarıyla ve bedeniyle sunduğu özel oral/anal haz ritüellerini tanımlayan evrensel VIP jargonu.",
  },
  {
    term: "Overnight (Sınırsız Gece)",
    definition: "Standart 1 veya 2 saatlik görüşmelerin aksine, akşamdan şafağa kadar (veya kahvaltı dahil) süren, zaman kaygısının olmadığı VIP konaklama paketi.",
  },
  {
    term: "Elit Kalkanı (Privacy Shield)",
    definition: "Randevu öncesi ve sonrası, müşterinin plakasının, adının veya kimliğinin sistemde 256-bit şifrelenip buluşma bittiği an imha edilme süreci.",
  },
  {
    term: "Elite Concierge",
    definition: "Escortvip'ye özel, müşterinin otele girişinden masasındaki şampanyaya kadar her şeyin asistanlar tarafından yönetildiği, VIP transferli A'dan Z'ye rehberlik ağ."
  },
  {
    term: "Role-Play (Fantezi Kurgusu)",
    definition: "Sekreter-patron, polis-suçlu gibi senaryoların önceden belirlenip, kostüm ve diyalogların (Dirty Talk) o anki atmosferi manipüle etmesi.",
  },
  {
    term: "Dirty Talk (Erotik Linguistik)",
    definition: "Kelimelerin biyolojik uyarılmaya (TF-IDF felsefesindeki gibi zihinsel tetiğe) dönüştüğü, sınırların sözcüklerle zorlandığı yakınlaşma sanatı.",
  },
  {
    term: "BBBJ / PSE (Elite Nuances)",
    definition: "Yüksek seviye yakınlaşma ve sınırsız haz standartlarınde (Bareback Behind / Personal Sexual Experience) güvenin ve tutkunun en doğal hali. Yalnızca seçkin partnerler tarafından sunulan özel bir hizmet derinliğidir.",
  },
  {
    term: "Duo / Threesome Protocol",
    definition: "İki veya daha fazla elit partnerin katılımıyla gerçekleşen, sinerjinin ve fantezinin maksimize edildiği çoklu eşlik deneyimi.",
  },
  {
    term: "Private Club Access",
    definition: "Sadece referanslı misafirlerin girebildiği, lokasyon ve profillerin tamamen kapalı devre yönetildiği en yüksek seviye Elit kulübü.",
  },
  {
    term: "Tam Gizlilik Matrix",
    definition: "Müşterinin dijital, finansal ve lokasyon bazlı tüm verilerinin görüşme anında şifrelenip, işlem bittiğinde merkezi algoritma tarafından geri döndürülemez şekilde silinmesi.",
    deepLink: "/ansiklopedi/gizlilik-matrisi"
  },
  {
    term: "VIP Escort Lojistiği",
    definition: "Partnerin randevu yerine transferi, güvenlik taraması ve zamanlama optimizasyonunu kapsayan profesyonel operasyonel süreç.",
  },
  {
    term: "Kızıl Tanrıça (Rare Asset)",
    definition: "Sektördeki en nadir bulunan, porselen tenli ve doğal kızıl saçlı escort profilini tanımlayan lüks statü terimi.",
  },
  {
    term: "Biyo-Hacking Seansı",
    definition: "Dr. DRKCNAY'ın geliştirdiği tekniklerle, randevu öncesi ve anında erkeğin performansını ve zindeliğini artıran mikro-besin ve atmosfer yönetimi.",
    deepLink: "/ansiklopedi/biyo-hacking"
  },
  {
    term: "Dirty Talk Linguistiği",
    definition: "Sözcüklerin frekans bazlı uyarılmaya dönüştüğü, zihinsel bariyerlerin Eda Nur metotlarıyla aşıldığı erotik iletişim sanatı.",
    deepLink: "/ansiklopedi/erotik-linguistik"
  }
];

export default function EncyclopediaPage() {
  const indexTerms = terms.filter((_, i) => i % 4 === 0); // Show selection for navigation

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-rose-600 selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto py-24 px-6 md:px-12 relative">
        {/* Floating Index (Desktop Only) */}
        <nav className="fixed left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
          {indexTerms.map((t, idx) => (
            <a
              key={idx}
              href={`#${t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="w-2 h-2 rounded-full bg-zinc-800 hover:bg-rose-600 hover:scale-150 transition-all duration-300 group relative"
            >
              <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-black uppercase tracking-widest text-zinc-500">
                {t.term}
              </span>
            </a>
          ))}
        </nav>

        <div className="mb-32 text-center">
          <div className="inline-flex items-center gap-3 bg-zinc-950 px-6 py-2 rounded-full border border-zinc-900 text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase mb-8">
            <Shield className="w-3 h-3" />
            LITERARY PROTOCOL
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase mb-6 leading-[0.8]">
            Elit <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">Anahtar</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 italic max-w-2xl mx-auto">
            Elite elit yapan şey sadece sahip oldukları değil, konuştukları frekanstır. Escortvip jargonunu ve kurallarını keşfedin.
          </p>
        </div>

        <div className="space-y-12">
          {terms.map((t, idx) => {
            const anchorId = t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <div
                key={idx}
                id={anchorId}
                className="bg-zinc-950/40 backdrop-blur-3xl border border-zinc-900 p-8 md:p-16 rounded-[3rem] hover:border-rose-600/50 transition-all duration-700 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity text-rose-600 font-black italic text-8xl -z-10">
                  {t.term[0]}
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic text-rose-500 mb-6 group-hover:text-rose-400 transition-colors tracking-tighter uppercase">
                  {t.term}
                </h2>
                <p className="text-zinc-400 text-lg md:text-2xl leading-relaxed font-medium italic border-l-4 border-zinc-900 group-hover:border-rose-600 pl-8 transition-colors">
                  {t.definition}
                </p>
                {t.deepLink && (
                  <Link
                    href={t.deepLink}
                    className="mt-8 inline-block text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-rose-600 pb-1 hover:text-rose-600 transition-colors"
                  >
                    Detaylı İncelemeyi Oku (VIP Elite) →
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-40 text-center space-y-12">
          <div className="h-px bg-linear-to-r from-transparent via-zinc-900 to-transparent"></div>
          <Link href="/standart" className="group text-zinc-500 hover:text-rose-500 font-black tracking-[0.4em] uppercase italic text-sm transition-all duration-500">
            TAM KATILIM <span className="text-white group-hover:text-rose-600">PROTOKOLÜNÜ</span> OKU →
          </Link>
        </div>
      </main>
    </div>
  );
}
