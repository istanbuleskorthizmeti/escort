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
import { cities } from '@/lib/locations';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Params {
  city: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: rawCity, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const host = (await headers()).get('host') || siteConfig.domain;
  const siteId = await getSiteId(host);
  
  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const cityName = cities[city]?.name || sanitizeDisplayName(city);

  const dbContent = await prisma.pageContent.findFirst({ where: { slug: `${city}-kategori-${slug}`, siteId } });

  return generateLocationMetadata({
    city,
    cityName,
    categoryTitle: category?.title || slug,
    customTitle: dbContent?.title || undefined,
    domain: host
  });
}

export default async function CityCategoryPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, slug } = await params;
  const city = decodeURIComponent(rawCity);
  const host = (await headers()).get('host') || siteConfig.domain;
  const siteId = await getSiteId(host);
  const theme = ThemeEngine.getTheme(host);

  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const cityName = cities[city]?.name || sanitizeDisplayName(city);

  let dbContent = await prisma.pageContent.upsert({
    where: { 
      slug_siteId: {
        slug: `${city}-kategori-${slug}`,
        siteId
      }
    },
    update: {}, // No updates needed if it exists
    create: {
      siteId,
      slug: `${city}-kategori-${slug}`,
      title: `${cityName.toUpperCase()} ${category?.title.toUpperCase() || slug.toUpperCase()} VIP`,
      content: `<p>${cityName} bölgesindeki en elit ${category?.title || slug} partnerler.</p>`
    }
  });

  const profiles = await getHybridProfiles({ city, category: slug, limit: 12 });
  const aiContent = await generateGodModeContent({ city, category: slug, host });

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${cityName} ${category?.title || slug}`,
    city: cityName,
    description: `${cityName} bölgesinde en iyi ${category?.title || slug} partner rehberi.`,
    url: `https://${host}/${city}/kategori/${slug}`,
    categoryTitle: category?.title || slug,
    faqs: aiContent.faqs,
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <div className={`min-h-screen ${theme.bgColor} ${theme.textColor} antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <Breadcrumbs items={[{ name: cityName, item: `/${city}` }, { name: category?.title || slug, item: `/${city}/kategori/${slug}` }]} />
        
        <section className="mb-24">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter italic uppercase">
            {cityName} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-200">
              {category?.title || slug} MODELLER
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium border-l-4 border-rose-600 pl-6 mb-10">
            {cityName} bölgesinde en lüks {category?.title || slug} deneyimi. %100 gerçek ilanlar.
          </p>
        </section>

        <HybridProfileGrid profiles={profiles} locationName={cityName} />
        <LongFormContent location={cityName} type="category" city={city} initialHtml={aiContent.html} category={slug} />
        <GrowthWidgets />
      </main>
      <UltraFooter host={host} cityName={cityName} />
    </div>
  );
}
