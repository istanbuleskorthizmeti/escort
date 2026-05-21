import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/site';
import { taxonomyCategories } from '@/lib/taxonomy';
import { generateLocationMetadata } from '@/lib/seo-metadata';
import { generateGodModeContent } from '@/lib/seo-content';
import { generateUltraGraphSchema } from '@/lib/seo-schema';
import { headers } from 'next/headers';
import { getSiteId } from '@/lib/site-context';
import { ThemeEngine } from '@/lib/theme-engine';
import Navbar from '@/components/UI/Navbar';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import { HybridProfileGrid } from '@/components/UI/HybridProfileGrid';
import { getHybridProfiles } from '@/lib/ad-service';
import { LongFormContent } from '@/components/UI/LongFormContent';
import { GrowthWidgets } from '@/components/UI/GrowthWidgets';
import { UltraFooter } from '@/components/SEO/UltraFooter';
import { sanitizeDisplayName } from '@/lib/utils';
import { cities, getCitiesForHost } from '@/lib/locations';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Params {
  city: string;
  district: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: rawCity, district: rawDistrict, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const district = decodeURIComponent(rawDistrict);
  const host = (await headers()).get('host') || siteConfig.domain;

  const allowedCities = getCitiesForHost(host);
  const cityObj = allowedCities[city.toLowerCase()];
  const distObj = cityObj?.districts.find((d: any) => d.slug === district);

  if (!cityObj || !distObj) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
  }

  const siteId = await getSiteId(host);
  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const cityName = cityObj.name;
  const districtName = distObj.name;

  const dbContent = await prisma.pageContent.findFirst({ where: { slug: `${city}-${district}-kategori-${slug}`, siteId } });

  return generateLocationMetadata({
    city,
    cityName,
    district,
    districtName,
    categoryTitle: category?.title || slug,
    customTitle: dbContent?.title || undefined,
    domain: host
  });
}

export default async function DistrictCategoryPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, district: rawDistrict, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const district = decodeURIComponent(rawDistrict);
  const host = (await headers()).get('host') || siteConfig.domain;

  const allowedCities = getCitiesForHost(host);
  const cityObj = allowedCities[city.toLowerCase()];
  const distObj = cityObj?.districts.find((d: any) => d.slug === district);

  if (!cityObj || !distObj) {
    return notFound();
  }

  const siteId = await getSiteId(host);
  const theme = ThemeEngine.getTheme(host);

  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const cityName = cityObj.name;
  const districtName = distObj.name;

  // 🏰 HYDRA CONTEXT: Isolated district-category content
  let dbContent = await prisma.pageContent.upsert({
    where: {
      slug_siteId: {
        slug: `${city}-${district}-kategori-${slug}`,
        siteId
      }
    },
    update: {},
    create: {
      siteId,
      slug: `${city}-${district}-kategori-${slug}`,
      title: `${districtName.toUpperCase()} ${category?.title.toUpperCase() || slug.toUpperCase()} VIP`,
      content: `<p>${cityName} ${districtName} bölgesindeki en elit ${category?.title || slug} partnerler.</p>`
    }
  });

  const profiles = await getHybridProfiles({ city, district, category: slug, limit: 12 });
  const aiContent = await generateGodModeContent({ city, district, category: slug, host });

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${districtName} ${category?.title || slug}`,
    city: cityName,
    description: `${cityName} ${districtName} bölgesinde en iyi ${category?.title || slug} partner rehberi.`,
    url: `https://${host}/${city}/${district}/kategori/${slug}`,
    categoryTitle: category?.title || slug,
    faqs: aiContent.faqs,
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <div className={`min-h-screen ${theme.bgColor} ${theme.textColor} antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <Breadcrumbs items={[{ name: cityName, item: `/${city}` }, { name: districtName, item: `/${city}/${district}` }, { name: category?.title || slug, item: `/${city}/${district}/kategori/${slug}` }]} />
        
        <section className="mb-24">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter italic uppercase">
            {districtName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-200">
              {category?.title || slug} MODELLER
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium border-l-4 border-rose-600 pl-6 mb-10">
            {cityName} {districtName} bölgesinde en lüks {category?.title || slug} deneyimi. %100 gerçek ilanlar.
          </p>
        </section>

        <HybridProfileGrid profiles={profiles} locationName={districtName} />
        <LongFormContent location={districtName} type="category" city={city} district={district} category={slug} initialHtml={aiContent.html} />
        <GrowthWidgets />
      </main>
      <UltraFooter host={host} cityName={cityName} />
    </div>
  );
}
