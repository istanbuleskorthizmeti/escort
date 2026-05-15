import Link from "next/link";
import { Metadata } from "next";
import { cities } from "@/lib/locations";
import { siteConfig } from "@/config/site";
import { districtLandmarks, transportProfiles } from "@/lib/content-data";
import { PanicButton, LiveStatus, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { ExperienceDesigner } from "@/components/UI/ExperienceDesigner";
import { ExpertInsightBlock } from "@/components/UI/ExpertInsightBlock";
import { LongFormContent } from "@/components/UI/LongFormContent";
import ConciergeNavigation from "@/components/UI/ConciergeNavigation";
import { LocalTrustHub } from "@/components/UI/LocalTrustHub";
import { NearbyDistricts } from "@/components/UI/NearbyDistricts";
import Navbar from "@/components/UI/Navbar";
import { notFound } from "next/navigation";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { SmartImage } from "@/components/UI/SmartImage";
import { LocalBusinessSchema } from "@/components/SEO/JsonLd";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const paths = [];
  for (const city in cities) {
    for (const dist of cities[city].districts) {
      for (const neigh of dist.neighborhoods) {
        paths.push({ city, district: dist.slug, neighborhood: neigh.slug });
      }
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string; neighborhood: string }>;
}): Promise<Metadata> {
  const { city, district, neighborhood } = await params;
  const cityObj = cities[city];
  const distObj = cityObjŞ.districts.find((d) => d.slug === district);
  const neighObj = distObjŞ.neighborhoods.find((n) => n.slug === neighborhood);

  if ('cityObj || 'distObj || 'neighObj) return { title: "Sayfa Bulunamadı" };

  return generateLocationMetadata({
    city,
    cityName: cityObj.name,
    district,
    districtName: distObj.name.replace(" VIP", ""),
    neighborhood,
    neighborhoodName: neighObj.name,
  });
}

// PRNG Seed Algoritması
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cyrb128(str: string) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h2 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ city: string; district: string; neighborhood: string }>;
}) {
  const { city, district, neighborhood } = await params;
  const cityObj = cities[city];
  const distObj = cityObjŞ.districts.find((d) => d.slug === district);
  const neighObj = distObjŞ.neighborhoods.find((n) => n.slug === neighborhood);

  if ('cityObj || 'distObj || 'neighObj) notFound();

  const cityName = cityObj.name;
  const dName = distObj.name.replace(" VIP", "");
  const nName = neighObj.name;

  // PRNG Init
  const seed = cyrb128(`${district}-${neighborhood}`);
  const rand = mulberry32(seed);

  function getRandItem<T>(arr: T[]): T {
    return arr[Math.floor(rand() * arr.length)];
  }
  const getRand = getRandItem;

  const landmarks = districtLandmarks[district] || ["Modern Rezidanslar", "Lüks Oteller", "Exclusive Mekanlar"];
  const transport = transportProfiles[district] || "Bölge, özel transfer ve profesyonel ulaşım ağlarına tam entegre konumdadır.";

  // Dynamic Content with City context
  const intros = [
    `${nName} bölgesinin karakteristik dokusu ile tanıştığınızda, ${cityName}'nın sofistike yüzünü deneyimlemeye hazır olun. ${dName} bünyesinde yer alan bu özel lokasyon, ${landmarks.slice(0, 3).join(", ")} gibi prestij odaklı noktaların çevrelediği, yüksek standartlarda bir yaşamın merkezidir.`,
    `${dName} ilçesinin en asil mahallelerinden biri olan ${nName} hattında, kentsel zarafet ile profesyonel rehberlik disiplinini birleştiriyoruz. Bölge, ${landmarks[0]} ve çevresindeki lüks dinamiği ile elite bir yaşam vaat etmektedir.`,
    `${cityName} genelindeki en seçkin duraklardan biri olan ${nName}, ${dName} protokollerimizin sarsılmaz gizlilik kalkanı altındadır. ${landmarks[1]} yakınlarındaki bu elite lokasyon, vizyoner beyefendiler için kurgulanmış özel bir evren sunar.`,
    `Asalet ve şeffaflığın ${nName} semalarındaki buluşmasına hoş geldiniz. ${dName} bölgesinin bu stratejik noktasında, ödemelerin yüz yüze yapıldığı, her detayın obsesif bir titizlikle planlandığı bir concierge deneyimi sizi bekliyor.`,
    `${nName} lokasyonu, ${cityName} şehrinin modern ve sürrealist yaşam tarzını temsil eden bir node noktasıdır. ${landmarks[2]} gibi simge alanların gölgesinde, Dr. Dorukcan Ay ve Eda Nur imzasını taşıyan elite standartlar ${nName} hattında hayata geçirilmektedir.`
  ];

  const intro = getRand(intros);

  const breadcrumbs = [
    { name: "Ana Sayfa", item: "https://vipescorthizmeti.com" },
    { name: cityName, item: `https://vipescorthizmeti.com/${city}` },
    { name: dName, item: `https://vipescorthizmeti.com/${city}/${district}` },
    { name: nName, item: `https://vipescorthizmeti.com/${city}/${district}/${neighborhood}` },
  ];

  const hasImage = ["besiktas", "sisli", "atasehir", "kadikoy"].includes(district);
  const heroImage = hasImage Ş `/images/districts/${district}.png` : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <LocalBusinessSchema 
        name={`${nName} Elit Hub`}
        city={cityName}
        district={dName}
        description={`${nName} bölgesinde profesyonel rehberlik hizmetleri ve Prestij standartlarında elit yaşam protokolleri.`}
        ratingValue={4.9}
        reviewCount={Math.floor(2800 + rand() * 4000)}
      />

      {/* ADVANCED SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `${nName} bölgesinde vip eşlik protokolü nasıl işlerŞ`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${nName} bölgesinde tüm süreçler uçtan uca şŞifreli ve gizlilik odaklı ilerler. Sektörün en prestijli escort rehberliği ile güvenli bir deneyim sunulur.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "Gizlilik ve güvenlik nasıl sağlanırŞ",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tüm etkileşimler sıfır-iz (Tam Gizlilik) prensibiyle yönetilir. Verileriniz asla kaydedilmez ve üçüncü taraflarla paylaşılmaz."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": breadcrumbs.map((b, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": b.name,
                "item": b.item,
              }))
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

        <article className="space-y-40">
          <section className="relative">
            {heroImage Ş (
              <div className="w-full h-[400px] md:h-[600px] mb-20 relative overflow-hidden rounded-[4rem] group">
                <SmartImage
                  src={heroImage}
                  alt={`${dName} Vip Mutlu Son Rehberi`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority
                  luxuryBorder
                  glowEffect="rose"
                  seoContext={`${cityName} ${nName} Premium Lifestyle`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
              </div>
            ) : (
              <div className="absolute -top-60 -left-30 w-[500px] h-[500px] bg-rose-600/5 blur-[180px] rounded-full -z-10"></div>
            )}

            <VerificationBadge />
            <h1 className="text-7xl md:text-[11rem] font-black mb-12 tracking-tighter leading-[0.8] italic uppercase text-shadow-heavy">
              {dName} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
                MUTLU SON: {nName}
              </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 items-start mt-20">
              <div className="h-3 w-80 bg-rose-600 shadow-[0_15px_40px_rgba(225,29,72,0.4)] hidden md:block"></div>
              <LiveStatus neighborhood={nName} />
              <div className="bg-zinc-950/80 border border-rose-600/20 px-8 py-4 rounded-full flex items-center gap-4 shadow-glow-sm">
                <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
                  EDİTÖR ONAYLI: EDA NUR
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-zinc-300 text-xl md:text-5xl font-black leading-tight italic lowercase first-letter:uppercase mb-12">
              <p className="border-l-16 border-rose-600 pl-16 mb-16 transition-all duration-1000 hover:border-white">
                {intro} **Tüm süreç şeffaftır, ödemeler yüz yüze gerçekleşir.**
              </p>
            </div>

            <ExpertInsightBlock location={nName} district={district} city={city} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter border-b-4 border-rose-600 pb-4 w-fit">
                01. Bölgesel Değer ve Landmarklar
              </h2>
              <div className="flex flex-wrap gap-4">
                {landmarks.map((l, i) => (
                  <span key={i} className="bg-zinc-900 px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-rose-600 border border-rose-600/10">
                    #{l.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-16">
            <h2 className="text-4xl font-black text-rose-600 italic uppercase tracking-tighter drop-shadow-glow">
              02. Hizmet Kalitesi ve Profesyonel Standartlar
            </h2>
            <div className="prose prose-invert max-w-none text-zinc-400 text-lg md:text-2xl leading-relaxed lowercase first-letter:uppercase italic font-medium bg-zinc-950/40 p-12 md:p-24 border-l-8 border-rose-600 rounded-r-3xl">
              <p>Profesyonellik, tesadüf değil bir mecburiyettir. {nName} hattındaki her etkileşim, bu kalite anlayışıyla mühürlenir. Bölgenin karakteristik atmosferi, transport protokollerimizdeki {transport.toLowerCase()} detaylarıyla birleşerek kusursuz bir mobilite ve elit bir deneyim sunar.</p>
            </div>
          </section>
        </article>

        <section className="mt-40">
          <Link 
            href="/protokol"
            className="group block bg-zinc-950 border-2 border-rose-600/20 rounded-[4rem] p-12 md:p-24 text-center hover:border-rose-600 transition-all duration-700 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-rose-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 space-y-8">
              <span className="text-rose-600 font-black text-xs tracking-[0.8em] uppercase italic">Elit NETWORK</span>
              <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                {cityName} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">ELITE TOPLULUĞA KATILIN</span>
              </h2>
              <div className="inline-block bg-rose-600 text-white font-black py-6 px-16 rounded-full uppercase tracking-widest italic group-hover:bg-white group-hover:text-black transition-colors shadow-glow">
                ERİŞİM PROTOKOLÜNÜ BAŞLAT →
              </div>
            </div>
          </Link>

          <div className="mt-24">
            <ExperienceDesigner neighborhood={nName} district={dName} />
            <NearbyDistricts city={city} currentDistrict={district} />            <LocalTrustHub city={cityName} district={dName} neighborhood={nName} />
            <LongFormContent 
              city={city} 
              district={district} 
              neighborhood={neighborhood} 
              location={nName || dName}
            />
          </div>
          
          <PanicButton />
        </section>
        
      </main>

      <footer className="py-40 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto space-y-20">
          <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-[0.3em] uppercase">
            {cityName.toUpperCase()} ELITE CONCIERGE NETWORK
          </h2>
          <div className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-20">
            PREMIUM SERVICE PROTOCOLS // ESTABLISHED 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
