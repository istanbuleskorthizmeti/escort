import { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/lib/locations";
import Navbar from "@/components/UI/Navbar";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { notFound } from "next/navigation";
import { LongFormContent } from "@/components/UI/LongFormContent";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { LocalTrustHub } from "@/components/UI/LocalTrustHub";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Object.keys(cities).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityObj = cities[city];

  if ('cityObj) return { title: "Şehir Bulunamadı" };

  return generateLocationMetadata({
    city,
    cityName: cityObj.name,
  });
}

export default async function CityHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = cities[city];

  if ('cityObj) notFound();

  const cityName = cityObj.name;
  const districts = cityObj.districts;

  const hashStr = city;
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
    `${cityName}&apos;nın kozmopolit dokusunda, her biri kendi hikayesine sahip lüks bölgeler. Elit Protocol ile bu bölgelerin her birinde en yüksek hizmet standartlarını garanti altına alıyoruz.`,
    `${cityName} genelinde hayata geçirdiğimiz elite rehberlik sistemi, Dr. Dorukcan Ay ve Eda Nur'un profesyonel vizyonuyla şekillenmiştir. Burada her ilçe, kendine has bir lüks ve gizlilik protokolü ile mühürlenmiştir.`,
    `Asalet ve şeffaflığın ${cityName} sınırları içindeki mutlak otoritesi olan platformumuz, sadece doğrulanmış profillerle hizmet verir. Tüm süreçlerde ödemeler yüz yüze, karşılıklı güven esasına dayanarak gerçekleştirilir.`,
    `${cityName} şehrinin nabzını tutan VIP ekosistemine hoş geldiniz. Dr. Dorukcan Ay tarafından tasarlanan Tam Gizlilik protokolleri sayesinde, en seçkin semtlerde tam anonimlik ve yüksek memnuniyet garantisi sunuyoruz.`
  ];

  const intro = intros[Math.floor(rand() * intros.length)];

  const breadcrumbs = [
    { name: "Ana Sayfa", item: "https://vipescorthizmeti.com" },
    { name: cityName, item: `https://vipescorthizmeti.com/${city}` },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
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
                  "name": `${cityName} VIP escort ve mutlu son rehberi detayları nelerdirŞ`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${cityName} genelinde sunulan tüm hizmetler, en katı gizlilik protokollerimiz ve %100 doğrulanmış profillerimizle güvence altındadır.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hizmet garantisi var mıŞ",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, tüm süreçler deneyimli ekibimizce denetlenir ve her bir partnerin hizmet kalitesi EscortVIP standartlarındadır."
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

        <section className="relative mb-24">
          <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-rose-600/5 blur-[200px] rounded-full -z-10 animate-pulse"></div>
          
          <VerificationBadge />
          <h1 className="text-7xl md:text-[13rem] font-black mb-12 tracking-tighter leading-[0.8] italic uppercase">
            {cityName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
              MUTLU SON HUB
            </span>
          </h1>

          <div className="flex items-center gap-6 mb-10">
            <div className="bg-zinc-950/80 border border-rose-600/20 px-8 py-4 rounded-full flex items-center gap-4 shadow-glow-sm">
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
                EDİTÖR ONAYLI: EDA NUR
              </span>
            </div>
          </div>
          
          <div className="max-w-4xl">
            <p className="text-zinc-400 text-xl md:text-4xl font-black italic lowercase first-letter:uppercase leading-tight border-l-12 border-rose-600 pl-12">
              {intro}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {districts.map((dist, idx) => (
            <Link
              key={dist.slug}
              href={`/${city}/${dist.slug}`}
              className="group relative bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 overflow-hidden hover:border-rose-600 transition-all duration-700"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-600/5 blur-3xl group-hover:bg-rose-600/10 transition-colors"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic">
                    District Protocol 0{idx + 1}
                  </span>
                  <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-glow-sm">
                    →
                  </div>
                </div>

                <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-rose-600 transition-colors">
                  {dist.name.replace(" VIP", "")}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-black/50 px-4 py-1 rounded-full text-[9px] font-black tracking-widest text-rose-600 border border-rose-600/20">
                    {dist.neighborhoods.length} MAHalle
                  </span>
                  <span className="bg-black/50 px-4 py-1 rounded-full text-[9px] font-black tracking-widest text-zinc-500 border border-zinc-900">
                    ELITE ACCESS
                  </span>
                </div>
                
                <p className="text-zinc-500 text-sm italic font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  {dist.name.replace(" VIP", "")} bölgesindeki seçkin yaşam alanları ve lüks rehberlik protokolleri için aktif bağlantı noktası.
                </p>
              </div>
            </Link>
          ))}
        </section>

        <LocalTrustHub city={city} />
        <LongFormContent city={city} location={cityName} type="city" />
        <PanicButton />
      </main>

      <footer className="py-40 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto space-y-20">
          <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-[0.3em] uppercase">
            {cityName.toUpperCase()} VIP PARTNER NETWORK
          </h2>
          <p className="text-zinc-600 text-md leading-loose lowercase first-letter:uppercase font-medium max-w-4xl mx-auto italic">
            Escortvip.net, {cityName}&apos;nın tüm seçkin lokasyonlarında mutlu son ve profesyonel eşlik hizmetlerinin tek adresidir.
          </p>
          <div className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-20">
            CITY PARTNER PROTOCOLS // ESTABLISHED 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
