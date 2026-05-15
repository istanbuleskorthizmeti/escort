import Link from "next/link";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${title} | İstanbul VIP Profesyonel Şehir Rehberi`,
    description: `${title} üzerine İstanbul'un en seçkin ve teknik detaylarını kapsayan profesyonel yaşam rehberi. Premium erişim protokolleri vipescorthizmeti.com'te.`,
    alternates: { canonical: `https://${siteConfig.domain}/rehber/${slug}` }
  };
}

export async function generateStaticParams() {
  return [
    { slug: "bosphorus-protocols" },
    { slug: "nightlife-confidential" },
    { slug: "high-rise-luxury" },
    { slug: "exclusive-dining" },
    { slug: "private-transfer-protocols" }
  ];
}

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const guides: Record<string, { title: string; category: string; content: string[] }> = {
    "bosphorus-protocols": {
      title: "BOĞAZ HATTI PROTOKOLLERİ: YALILAR VE İSKELELER",
      category: "LUXURY LIVING",
      content: [
        "İstanbul Boğazı'nın karakteristik dokusunda, ana arterlerden izole edilmiş özel yalı ve iskele bağlantıları, elit yaşamın en temel unsurlarından biridir. Yeniköy, Bebek ve Kandilli hattında konumlanan özel mülkler, kara trafiğinden bağımsız, deniz yoluyla erişilebilir profesyonel protokoller sunmaktadır.",
        "Çırağan Sarayı ve Four Seasons Bosphorus gibi ikonik lokasyonların sunduğu VIP iskele hizmetleri, gizlilik esaslı transferler için optimize edilmiştir. Bu noktalarda sağlanan erişim, en yüksek güvenlik standartları çerçevesinde koordine edilmektedir.",
        "İstanbul genelinde 7/24 aktif olan deniz transfer ağımız, konakladığınız veya bulunduğunuz noktadan sizi alarak, hedef lokasyona en diskret (gizli) şekilde ulaştırmayı hedefler. Profesyonel rehberlik hizmetlerimiz bu akışın tam merkezinde yer alır."
      ]
    },
    "nightlife-confidential": {
      title: "NIGHTLIFE CONFIDENTIAL: GİZLİ KULÜPLER VE LOUNGE ALANLARI",
      category: "ELITE SOCIAL",
      content: [
        "İstanbul gece hayatının standart akışından farklı olarak, sadece referans sistemiyle çalışan ve haritalarda yer almayan özel sosyal alanlar, elite segmentin buluşma noktalarıdır. Bu mekanlar, yüksek gizlilik ve nitelikli hizmet anlayışıyla yönetilmektedir.",
        "Kuruçeşme ve Nişantaşı lokasyonlarında bulunan özel üyelikli sistemler, misafirlerine izole bir eğlence ve ağ kurma (networking) imkanı tanır. Giriş süreçleri, profesyonel saha ekiplerimiz tarafından koordine edilen protokoller dahilinde gerçekleştirilir.",
        "Günün her saatinde aktif olan VIP saha koordinasyonumuz, talepleriniz doğrultusunda en uygun sosyal alanları ve rezervasyon seçeneklerini belirleyerek, kusursuz bir deneyim yaşamanızı sağlar."
      ]
    },
    "high-rise-luxury": {
      title: "HIGH-RISE LUXURY: GÖKYÜZÜNDEKİ REZİDANS YAŞAMI",
      category: "MODERN ARCHITECTURE",
      content: [
        "İstanbul'un dikey mimari merkezleri olan Levent ve Maslak hatları, Sapphire ve SkyLand gibi yapılarla modern lüksün zirvesini temsil etmektedir. Bu yapılar, sundukları tam izole süitler ve yüksek güvenlikli giriş çıkışlarıyla profesyonel rehberlik hizmetleri için ideal alanlardır.",
        "Şehir manzarasının ve modern teknolojinin birleştiği 50. kat ve üzeri yaşam alanlarında, dış dünyadan tamamen kopuk, sadece konfor odaklı bir atmosfer hakimdir. Bu ekosistemler, her türlü VIP ihtiyacın tek çatı altında karşılandığı protokol alanlarıdır.",
        "Rezidans yaşamının sunduğu concierge ve güvenlik avantajları, hizmet ağımızın operasyonel gücüyle birleşerek, misafirlerimize en konforlu deneyimi sunmayı garanti eder."
      ]
    },
    "exclusive-dining": {
      title: "EXCLUSIVE DINING: REFERANSLA KABUL EDİLEN MEKANLAR",
      category: "GASTRONOMY PROTOCOLS",
      content: [
        "Gastronomi dünyasında sadece belirli bir çevrenin erişebildiği kapalı devre restoranlar, İstanbul'un en özel deneyim alanlarını oluşturur. Bu mekanlar, yüksek mutfak standartları ve kişiye özel servis anlayışıyla öne çıkmaktadır.",
        "Gurme lezzetlerin yanı sıra, mekanların sunduğu izolasyon ve gizlilik imkanları, elite misafirlerimizin en çok önem verdiği kriterler arasındadır. Profesyonel rezervasyon ağımız, bu seçkin duraklarda her zaman öncelikli yer vadedir.",
        "Karaköy ve Nişantaşı'nın saklı teraslarından Boğaz hattındaki özel yalılara kadar geniş bir yelpazede sunulan bu gastronomi protokolleri, rehberlik hizmetimizin doğal bir tamamlayıcısıdır."
      ]
    },
    "private-transfer-protocols": {
      title: "PRIVATE TRANSFER: VIP ARAÇ VE YAT KOORDİNASYONU",
      category: "MOBILITY MANAGEMENT",
      content: [
        "Şehir içi mobilitede konfor ve hız, lüks yaşamın vazgeçilmezidir. Karartılmış camlı, tam donanımlı VIP transfer araçlarımız, misafirlerimizin lokasyonlar arası geçişlerini tamamen izole ve güvenli bir şekilde gerçekleştirmesini sağlar.",
        "Deniz ulaşımında ise özel yat koordinasyonumuz, trafiğin etkisinden uzak, Boğaz'ın keyfini çıkarırken aynı zamanda hedefe en hızlı şekilde varmayı mümkün kılar. Kaptanlarımız ve saha personelimiz en yüksek nezaket standartlarına göre eğitilmiştir.",
        "Havaalanı protokollerinden özel davet planlamalarına kadar her an aktif olan transfer ağımız, profesyonel lojistik desteğin İstanbul'daki en güçlü temsilcisidir."
      ]
    }
  };

  const guide = guides[slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-600 selection:text-white antialiased">
      <header className="py-10 px-6 border-b border-zinc-900 bg-black/90 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-black tracking-tighter hover:text-rose-600 transition-all">
            ESCORTVIP<span className="text-rose-600">.NET</span>
          </Link>
          <nav className="text-[10px] font-black tracking-[0.3em] flex gap-4 italic uppercase">
             <Link href="/" className="hover:text-rose-600 transition-colors">ANASAYFA</Link>
             <span className="text-zinc-800">/</span>
             <Link href="/rehber" className="hover:text-rose-600 transition-colors">ŞEHİR REHBERİ</Link>
             <span className="text-zinc-800">/</span>
             <span className="text-rose-600">{slug.replace(/-/g, ' ')}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-24 px-6 md:px-12">
        <article>
           <div className="mb-16">
              <span className="text-rose-600 font-black text-xs tracking-[0.5em] block mb-4 italic uppercase">{guide.category}</span>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tighter italic uppercase text-shadow-heavy">
                {guide.title}
              </h1>
              <div className="h-2 w-32 bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.4)]"></div>
           </div>

           <div className="space-y-12 text-zinc-400 text-xl md:text-2xl leading-relaxed lowercase first-letter:uppercase font-medium italic">
             {guide.content.map((p, i) => <p key={i} className="border-l-4 border-zinc-900 pl-8 hover:border-rose-600 transition-colors duration-500">{p}</p>)}
           </div>

           <div className="mt-24 p-16 border border-zinc-900 bg-zinc-950 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-rose-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <h4 className="text-white font-black text-3xl mb-8 italic tracking-tighter uppercase relative z-10">PROFESYONEL REZERVASYON VE KOORDİNASYON</h4>
              <p className="text-zinc-500 text-xs mb-12 leading-relaxed uppercase tracking-widest font-black italic relative z-10">
                İSTANBUL GENELİNDE TÜM SEÇKİN LOKASYONLARDA 7/24 PROFESYONEL SAHA DESTEĞİ.
              </p>
              <button className="bg-rose-600 hover:bg-rose-500 text-white font-black py-8 px-20 rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95 tracking-widest text-[10px] uppercase italic relative z-10">
                İLETİŞİM KANALLARI VE BİLGİ
              </button>
           </div>

           <div className="mt-24 flex flex-wrap gap-4 text-[10px] font-black tracking-widest text-zinc-600 justify-center uppercase italic">
              <Link href="/istanbul/besiktas/bebek" className="hover:text-rose-600 transition-colors">#BEBEK VIP</Link>
              <Link href="/istanbul/sisli/nisantasi" className="hover:text-rose-600 transition-colors">#NİŞANTAŞI VIP</Link>
              <Link href="/istanbul/sariyer/maslak" className="hover:text-rose-600 transition-colors">#MASLAK VIP</Link>
           </div>
        </article>
      </main>

      <footer className="py-40 border-t border-zinc-900 mt-20 text-center bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-[10px] font-black tracking-[0.4em] uppercase italic text-zinc-800">
               © 2026 vipescorthizmeti.com - PROTCOL ALPHA SYSTEM ACTIVE
            </div>
            <p className="text-zinc-700 text-[9px] font-black tracking-[0.2em] uppercase italic max-w-xl mx-auto leading-loose">
               Tüm rehber içerikleri ve protokoller, İstanbul elite yaşam standartları gözetilerek profesyonel ekiplerimizce hazırlanmıştır.
            </p>
        </div>
      </footer>
    </div>
  );
}
