import { Metadata } from "next";
import { cities } from "@/lib/locations";
import { districtLandmarks } from "@/lib/content-data";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { LongFormContent } from "@/components/UI/LongFormContent";
import Navbar from "@/components/UI/Navbar";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { toTitleCaseTR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 3600;

// Yüksek sayfa hacmi (100k+) nedeniyle statik üretim çalışma zamanına (on-demand) devredildi.
export async function generateStaticParams() {
  return []; // Build sırasında sayfa üretme, istek geldikçe (ISR) üret.
}

const slugifyTR = (text: string) => {
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text.split('').map(char => trMap[char] || char).join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string; neighborhood: string; landmark: string }>;
}): Promise<Metadata> {
  const { city, district, neighborhood, landmark } = await params;
  const cityObj = cities[city];
  const distObj = cityObj?.districts.find((d) => d.slug === district);
  const neighObj = distObj?.neighborhoods.find((n) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
  }

  const rawLandmarks = districtLandmarks[district] || [];
  const realLandmarkName = rawLandmarks.find(l => slugifyTR(l) === landmark) || toTitleCaseTR(landmark.replace(/-/g, ' '));

  const cityName = cityObj?.name || toTitleCaseTR(city.replace(/-/g, ' '));
  const dName = distObj?.name?.replace(" VIP", "") || toTitleCaseTR(district.replace(/-/g, ' '));
  const nName = neighObj?.name || toTitleCaseTR(neighborhood.replace(/-/g, ' '));

  return generateLocationMetadata({
    city,
    cityName: cityName,
    district,
    districtName: dName,
    neighborhood,
    neighborhoodName: `${nName} ${realLandmarkName} Çevresi`
  });
}

export default async function LandmarkPage({
  params,
}: {
  params: Promise<{ city: string; district: string; neighborhood: string; landmark: string }>;
}) {
  const { city, district, neighborhood, landmark } = await params;
  const cityObj = cities[city];
  const distObj = cityObj?.districts.find((d) => d.slug === district);
  const neighObj = distObj?.neighborhoods.find((n) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    return notFound();
  }

  const cityName = cityObj.name;
  const dName = distObj.name.replace(" VIP", "");
  const nName = neighObj.name;

  const rawLandmarks = districtLandmarks[district] || [];
  const realLandmarkName = rawLandmarks.find(l => slugifyTR(l) === landmark) || toTitleCaseTR(landmark.replace(/-/g, ' '));

  const breadcrumbItems = [
    { name: cityName, item: `https://${siteConfig.domain}/${city}` },
    { name: dName, item: `https://${siteConfig.domain}/${city}/${district}` },
    { name: nName, item: `https://${siteConfig.domain}/${city}/${district}/${neighborhood}` },
    { name: realLandmarkName, item: `https://${siteConfig.domain}/${city}/${district}/${neighborhood}/${landmark}` },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": `https://${siteConfig.domain}` },
                ...breadcrumbItems.map((b, i) => ({
                  "@type": "ListItem",
                  "position": i + 2,
                  "name": b.name,
                  "item": b.item,
                }))
              ]
            }
          ])
        }}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <Breadcrumbs items={breadcrumbItems} />

        <section className="relative mt-20 mb-32">
          <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-rose-600/5 blur-[200px] rounded-full z-0"></div>
          <VerificationBadge />
          <h1 className="text-5xl md:text-[8rem] font-black mt-8 mb-12 tracking-tighter leading-[0.8] italic uppercase text-shadow-heavy relative z-10">
            {realLandmarkName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
              ELITE VIP LOCA
            </span>
          </h1>

          <div className="prose prose-invert max-w-none text-zinc-300 text-xl font-medium leading-relaxed italic border-l-8 border-rose-600 pl-8 bg-zinc-950/40 p-8 rounded-r-3xl">
            <p>
              {nName} sınırları içerisinde yer alan {realLandmarkName} ve çevresi, Elit Network kuralları dahilinde &quot;Keskin VIP&quot; (Strict VIP) alanı olarak sınıflandırılmıştır. {cityName} genelindeki en yüksek gizlilik ve lüks standartları bu noktadaki görüşmeler için doğrudan uygulanır. 
            </p>
          </div>
        </section>
        
        <LongFormContent location={`${realLandmarkName} Yakını`} type="neighborhood" city={city} district={district} neighborhood={neighborhood} />
        
        <PanicButton />
      </main>
    </div>
  );
}
