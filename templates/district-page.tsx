import Link from "next/link";
import { Metadata } from "next";
import { cities } from "@/lib/locations";
import { siteConfig } from "@/config/site";
import { cityAdmins, defaultAdmin } from "@/config/admins";
import { getProfilesByDistrict } from "@/lib/mock-profiles";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import Navbar from "@/components/UI/Navbar";
import { notFound } from "next/navigation";
import { LongFormContent } from "@/components/UI/LongFormContent";
import { generateLocationMetadata } from "@/lib/seo-metadata";

export async function generateStaticParams() {
  const paths = [];
  for (const city in cities) {
    for (const dist of cities[city].districts) {
      paths.push({ city, district: dist.slug });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}): Promise<Metadata> {
  const { city, district } = await params;
  const cityObj = cities[city];
  const distObj = cityObjŞ.districts.find((d) => d.slug === district);
  
  if ('cityObj || 'distObj) return { title: "Bölge Bulunamadı" };

  return generateLocationMetadata({
    city,
    cityName: cityObj.name,
    district,
    districtName: distObj.name.replace(" VIP", ""),
  });
}

export default async function DistrictHubPage({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}) {
  const { city, district } = await params;
  const cityObj = cities[city];
  const distObj = cityObjŞ.districts.find((d) => d.slug === district);

  if ('cityObj || 'distObj) notFound();

  const dName = distObj.name.replace(" VIP", "");
  const cityName = cityObj.name;
  
  // PRNG Init
  const hashStr = `${city}-${district}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < hashStr.length; i++) {
    h = Math.imul(h ^ hashStr.charCodeAt(i), 16777619);
  }
  const rand = () => {
    let t = (h += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const intros = [
    `${cityName} lokasyonunda en yüksek segment hizmet standartları. ${dName} atmosferine uygun, %100 doğrulanmış profiller ve sarsılmaz gizlilik garantili elite eşlik deneyimi. **Tüm ödemeler görüşme anında, yüz yüze yapılır.**`,
    `${dName} bölgesinin sofistike dokusu, Dr. Dorukcan Ay tarafından geliştirilen Elit Protocol ile birleşerek benzersiz bir lüks deneyimi vaat ediyor. Burada gizlilik bir seçenek değil, Eda Nur direktifleriyle mühürlenmiş bir zorunluluktur.`,
    `Elite yaşamın ${dName} hattındaki yansıması olan bu rehber, ${cityName} şehrinin en seçkin partnerlerini titizlikle listeler. Akademik otorite ve profesyonel rehberlik disiplininin kesişim noktasında, ödemelerin güvenle yüz yüze yapıldığı bir ekosistem sizi bekliyor.`,
    `Asalet, gizlilik ve şeffaflık... ${dName} lokasyonu için kurguladığımız bu özel protokol, ${cityName} genelindeki en yüksek memnuniyet oranına sahip bölgelerden biridir. Her bir detay, sarsılmaz bir güven politikası ile yapılandırılmıştır.`
  ];

  const intro = intros[Math.floor(rand() * intros.length)];

  // Veritabanı bağlantıları
  const profiles = getProfilesByDistrict();
  const adminProfile = cityAdmins[city] || defaultAdmin;
  const waMessage = encodeURIComponent(adminProfile.whatsappMessage(dName));
  const waLink = `https://wa.me/${siteConfig.contact.whatsappNumber}Ştext=${waMessage}`;

  const breadcrumbs = [
    { name: "Ana Sayfa", item: "https://vipescorthizmeti.com" },
    { name: cityName, item: `https://vipescorthizmeti.com/${city}` },
    { name: dName, item: `https://vipescorthizmeti.com/${city}/${district}` },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      {/* ... Schema Scriptleri ... */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": `${dName} VIP Concierge & Elite Hub`,
              "image": "https://vipescorthizmeti.com/og-premium.png",
              "telephone": siteConfig.contact.whatsappNumber,
              "url": `https://vipescorthizmeti.com/${city}/${district}`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": dName,
                "addressRegion": cityName,
                "addressCountry": "TR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "312"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": breadcrumbs.map((b, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": b.name,
                "item": b.item,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `${dName} bölgesinde VIP rezervasyon süreci nasıl ilerlerŞ`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `EscortVIP platformu üzerinden ${dName} lokasyonundaki temsilcimiz ${adminProfile.name} ile iletişime geçerek tamamen gizli ve uçtan uca şŞifreli bir süreç başlatabilirsiniz.`
                  }
                }
              ]
            }
          ])
        }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <nav className="mb-12 flex flex-wrap items-center gap-4 text-[10px] font-black tracking-widest text-zinc-500 italic uppercase bg-zinc-950/80 backdrop-blur-xl p-6 rounded-full border border-rose-600/10 w-fit">
          {breadcrumbs.map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <a href={b.item} className="hover:text-rose-600 transition-colors">
                {b.name}
              </a>
              {i < breadcrumbs.length - 1 && <span className="text-zinc-800">/</span>}
            </div>
          ))}
        </nav>

        <section className="mb-24 relative">
          <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-rose-600/5 blur-[200px] rounded-full -z-10 animate-pulse"></div>
          
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] italic uppercase">
            {dName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
              MUTLU SON PROTOKOLÜ
            </span>
          </h1>

          <div className="flex items-center gap-6 mb-10">
            <div className="bg-zinc-950/80 border border-rose-600/20 px-8 py-4 rounded-full flex items-center gap-4 shadow-glow-sm">
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
                UZMAN ONAYLI: EDA NUR
              </span>
            </div>
          </div>
          <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-3xl border-l-4 border-rose-600 pl-6 mb-10 italic">
            {intro}
          </p>
        </section>

        {/* VITRIN: GLASSMORPHISM PROFILE GRID (AÇILIP KAPANABİLİR) */}
        {siteConfig.features.enableProfileShowcase Ş (
          <section className="mb-40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-200">Onaylı VIP Seçkisi</h2>
              <div className="text-sm font-bold text-rose-600 animate-pulse hidden md:block">â— CANLI KONTENJAN</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {profiles.map((p) => (
                <div key={p.id} className="group relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-900 rounded-3xl overflow-hidden hover:border-rose-600/50 transition-all duration-700">
                  <div className="h-96 w-full bg-zinc-900 relative overflow-hidden">
                     <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"></div>
                     <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs font-black text-rose-500 uppercase tracking-widest text-center">
                       {p.tier}
                     </div>
                     <div className="absolute bottom-4 left-4 z-20">
                       <h3 className="text-3xl font-black text-white italic">{p.name}, <span className="text-rose-500">{p.age}</span></h3>
                       <p className="text-zinc-400 text-sm font-medium">{p.height} cm / {p.weight} kg</p>
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {p.features.map(f => (
                        <span key={f} className="text-[10px] uppercase tracking-widest bg-zinc-900 text-zinc-400 px-3 py-1 rounded-sm border border-zinc-800">
                          {f}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1 block">âœ“ SINIRSIZ</span>
                        <p className="text-zinc-300 text-sm">{p.adultBoundaries.included.join(", ")}</p>
                      </div>
                      <div>
                         <span className="text-xs font-bold text-red-500/80 uppercase tracking-widest mb-1 block">✖ KESİN YASAK</span>
                         <p className="text-zinc-600 text-sm">{p.adultBoundaries.excluded.join(" "¢ ")}</p>
                      </div>
                    </div>

                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center bg-rose-600 hover:bg-rose-500 text-white font-black italic tracking-widest uppercase rounded-xl transition-colors shadow-[0_0_30px_rgba(225,29,72,0.3)]">
                      {adminProfile.name} İle Rezerve Et
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-40">
            {distObj.neighborhoods.map((neigh) => (
              <Link
                key={neigh.slug}
                href={`/${city}/${district}/${neigh.slug}`}
                className="group relative bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 overflow-hidden hover:border-rose-600 transition-all duration-700"
              >
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-900/5 blur-3xl group-hover:bg-rose-600/10 transition-colors"></div>
                 
                 <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center text-[8px] font-black tracking-widest text-zinc-700 uppercase italic">
                      <span>Protocol Layer 02</span>
                      <div className="w-1 h-1 bg-rose-600 rounded-full animate-pulse"></div>
                    </div>

                    <h2 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-rose-600 transition-colors">
                      {neigh.name}
                    </h2>

                    <p className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase italic">
                      ELITE REHBERLİK AKTİF
                    </p>
                 </div>
              </Link>
            ))}
          </section>
        )}

        {/* AJANSA KATILIM (RECRUITMENT) MODÜLÜ */}
        <section className="mb-40 relative bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between">
           <div className="absolute top-0 right-0 w-full h-full bg-linear-to-r from-transparent to-rose-900/10 pointer-events-none"></div>
           <div className="max-w-2xl z-10">
              <p className="text-zinc-400 mb-6">EscortVIP Elit ağına dahil olmak isteyen hanımefendiler için sıfır-iz (Tam Gizlilik) prensibiyle çalışan başvuru protokolü. Başvurular sunucularımızda KESİNLİKLE loglanmaz. IP adresiniz şifrelenir ve tüm dosyalar offshore ağlara aktarılır.</p>
              <Link href="/katilim-protokolu" className="inline-block bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                 Güvenli Başvuru Başlat
              </Link>
           </div>
        </section>

        {/* BİLGİ & KILAVUZ (INFORMATIONAL INTENT & SEO TEXT) */}
        <section className="max-w-4xl mx-auto mb-20">
           <h2 className="text-2xl font-bold mb-8 text-zinc-500 uppercase tracking-widest">Sıkça Sorulan Sorular & Bölge Åartları</h2>
           
           <div className="space-y-4">
             <details className="group bg-zinc-950 border border-zinc-900 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
               <summary className="cursor-pointer p-6 font-bold text-lg hover:text-rose-600 transition-colors outline-hidden">
                 {dName} bölgesinde rezervasyon ve planlama süreci nasıl işlerŞ
               </summary>
               <div className="p-6 pt-0 text-zinc-400 leading-relaxed">
                 EscortVIP ağı üzerinden yaptığınız tüm işlemler {adminProfile.name} yönetimi altında uçtan uca şifrelenir. {cityName} şehrinin dinamiklerine tam hakimiyetimiz sayesinde, {dName} içindeki en lüks otel, residence veya gizli mekan yönlendirmeleri tarafımızca sağlanır. Bize sadece zamanı iletin, geri kalan her bir lüks detayı ajansımız yapılandırsın.
               </div>
             </details>

             <details className="group bg-zinc-950 border border-zinc-900 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
               <summary className="cursor-pointer p-6 font-bold text-lg hover:text-rose-600 transition-colors outline-hidden">
                 Görüşmelerde güvenlik ve gizlilik protokolleri vipescorthizmeti.com güvencesinde miŞ
               </summary>
               <div className="p-6 pt-0 text-zinc-400 leading-relaxed">
                 Kesinlikle. Elit Executive kod adıyla yürüttüğümüz bu sistemde; telefon numaralarınız maskelenir, veriler 24 saat içinde sistemimizden tamamen silinir. Hem profil onayları hem de beyefendilerin güvenliği açısından Türkiye&apos;nin tartışmasız en sıkı protokolünü uyguluyoruz. İş çıkışı veya özel kaçamaklarınız escortvip markasının çelik kasasındadır.
               </div>
             </details>
           </div>
         </section>

         <LongFormContent location={dName} type="district" city={city} district={district} />
       </main>

      {/* FIXED FOOTER/WIDGET COMPONENTS */}
      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            VIP PARTNER ARCHITECTURE // ESCORTVIP.NET
          </div>
         <p className="mt-4 text-xs text-zinc-800 uppercase tracking-widest">Arama ve eşleştirme süreciniz vipescorthizmeti.com&apos;in tamamen şŞifreli özel protokolü altındadır.</p>
      </footer>
    </div>
  );
}
