import { Metadata } from "next";
import { sanitizeDisplayName } from "@/lib/utils";
import { cities } from "@/lib/locations";
import { ThemeEngine } from "@/lib/theme-engine";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { ElitePromoBanner } from "@/components/UI/ElitePromoBanner";
import { LongFormContent } from "@/components/UI/LongFormContent";
import Navbar from "@/components/UI/Navbar";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { generateGodModeContent } from "@/lib/seo-content";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { getHybridProfiles } from "@/lib/ad-service";
import { HybridProfileGrid } from "@/components/UI/HybridProfileGrid";
import { prisma } from "@/lib/prisma";
import { GrowthWidgets } from "@/components/UI/GrowthWidgets";
import { getSiteId, getCanonicalHost } from "@/lib/site-context";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface Params {
  city: string;
  district: string;
  neighborhood: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: rawCity, district: rawDistrict, neighborhood: rawNeighborhood, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const district = decodeURIComponent(rawDistrict);
  const neighborhood = decodeURIComponent(rawNeighborhood);
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const siteId = await getSiteId(host);
  
  const cityObj = cities[city];
  const distObj = cityObj?.districts.find((d) => d.slug === district);
  const neighObj = distObj?.neighborhoods.find((n) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    const fullSlug = `${city}-${district}-${neighborhood}-kategori-${slug}`;
    const dbContent = await prisma.pageContent.findFirst({ where: { slug: fullSlug, siteId } });
    if (!dbContent) {
      return {
        title: "Sayfa Bulunamadı",
        robots: { index: false, follow: false, noarchive: true }
      };
    }
  }

  return generateLocationMetadata({
    city,
    cityName: cityObj?.name || city,
    district,
    districtName: distObj?.name || district,
    neighborhood,
    neighborhoodName: neighObj?.name || neighborhood,
    customTitle: `${neighborhood.toUpperCase()} ${slug.toUpperCase()} VIP`,
    domain: host
  });
}

export default async function DeepCategoryPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, district: rawDistrict, neighborhood: rawNeighborhood, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const district = decodeURIComponent(rawDistrict);
  const neighborhood = decodeURIComponent(rawNeighborhood);
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const siteId = await getSiteId(host);

  const cityObj = (cities as any)[city];
  const distObj = cityObj?.districts?.find((d: any) => d.slug === district);
  const neighObj = distObj?.neighborhoods?.find((n: any) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    const fullSlug = `${city}-${district}-${neighborhood}-kategori-${slug}`;
    const dbContent = await prisma.pageContent.findFirst({ where: { slug: fullSlug, siteId } });
    if (!dbContent) {
      return notFound();
    }
  }

  const nName = neighObj?.name || sanitizeDisplayName(neighborhood);
  const dName = distObj?.name || sanitizeDisplayName(district);
  const cityName = cityObj?.name || sanitizeDisplayName(city);
  const catName = slug.replace(/-/g, ' ').toUpperCase();

  const profiles = await getHybridProfiles({ city, district, neighborhood, category: slug, limit: 12 });
  const theme = ThemeEngine.getTheme(host);
  const aiContent = await generateGodModeContent({ city, district, neighborhood: nName, category: slug, host });

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${nName} ${catName}`,
    city: cityName,
    description: `${cityName} ${dName} ${nName} bölgesinde en iyi ${catName} partner rehberi.`,
    url: `https://${host}/${city}/${district}/${neighborhood}/kategori/${slug}`,
    categoryTitle: `${catName} VIP Escort`,
    faqs: aiContent.faqs,
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <div className={`min-h-screen ${theme.bgColor} ${theme.textColor} antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <Breadcrumbs items={[{ name: cityName, item: `/${city}` }, { name: dName, item: `/${city}/${district}` }, { name: nName, item: `/${city}/${district}/${neighborhood}` }, { name: catName, item: `/${city}/${district}/${neighborhood}/kategori/${slug}` }]} />
        <section className="mb-24">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter italic uppercase">
            {nName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-200">
              {catName} PARTNERLER
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium border-l-4 border-rose-600 pl-6 mb-10 leading-tight">
            {cityName} {dName} {nName} bölgesinde en elit {catName} deneyimi. %100 gizlilik garantisi.
          </p>
        </section>
        <HybridProfileGrid profiles={profiles} locationName={nName} />
        <LongFormContent location={nName} type="category" city={city} district={district} initialHtml={aiContent.html} />
        <GrowthWidgets />
      </main>
    </div>
  );
}
