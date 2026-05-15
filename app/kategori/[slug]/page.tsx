import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { taxonomyCategories } from "@/lib/taxonomy";
import { getStitchedContent } from "@/lib/obsidian-fragments";
import { cities } from "@/lib/locations";
import { SecureHTML } from "@/components/SecureHTML";
import { HybridProfileGrid } from "@/components/UI/HybridProfileGrid";
import { getHybridProfiles } from "@/lib/ad-service";
import { siteConfig } from "@/config/site";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { headers } from "next/headers";
import { ThemeEngine } from "@/lib/theme-engine";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const host = (await headers()).get("host") || siteConfig.domain;

  if (!category) {
    const formattedSlug = slug.replace(/-/g, ' ').toUpperCase();
    return generateLocationMetadata({
      city: "istanbul",
      cityName: "İSTANBUL",
      categoryTitle: formattedSlug,
      domain: host,
      customTitle: `🔥 ${formattedSlug} | %100 GERÇEK İLANLAR | DRKCNAY VIP`
    });
  }

  return generateLocationMetadata({
    city: "istanbul", 
    cityName: "İSTANBUL",
    categoryTitle: category.shortTitle,
    domain: host
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = taxonomyCategories[slug as keyof typeof taxonomyCategories];
  const host = (await headers()).get("host") || siteConfig.domain;
  const theme = ThemeEngine.getTheme(host);

  if (!category) notFound();

  const seoContent = getStitchedContent(slug.length * 1500, 2000);
  const profiles = await getHybridProfiles({ city: "istanbul", category: slug, limit: 12 });

  const breadcrumbs = [
    { name: "Ana Sayfa", item: "/" },
    { name: "Kategoriler", item: "/kategori" },
    { name: category.shortTitle, item: `/kategori/${slug}` },
  ];

  const cityKeys = Object.keys(cities).slice(0, 8);

  return (
    <div className={`min-h-screen ${theme.bgColor} ${theme.textColor} font-sans selection:bg-rose-600 selection:text-white antialiased`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": category.title,
              "description": category.seoDescription,
              "provider": {
                "@type": "Organization",
                "name": "DRKCNAY ELITE",
                "url": `https://${host}`
              },
              "areaServed": "TR",
              "category": category.shortTitle
            }
          ])
        }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto py-12 md:py-24 px-6 md:px-12">
        <nav className="mb-12 flex flex-wrap items-center gap-4 text-[10px] font-black tracking-widest text-zinc-500 italic uppercase bg-zinc-950/50 p-6 rounded-full border border-zinc-900 w-fit">
          {breadcrumbs.map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <Link href={b.item} className="hover:text-rose-600 transition-colors">
                {b.name}
              </Link>
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </div>
          ))}
        </nav>

        <section className="relative mb-24">
          <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-rose-600/5 blur-[200px] rounded-full -z-10 animate-pulse"></div>
          
          <VerificationBadge />
          
          <div className="mb-8 inline-flex items-center gap-3 bg-zinc-950 border border-rose-600/30 px-6 py-2 rounded-full shadow-glow-rose">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase">
              {category.tier} TIER PROTOCOL
            </span>
          </div>

          <h1 className="text-5xl md:text-[8rem] font-black mb-12 tracking-tighter leading-[0.8] italic uppercase">
            {category.title.split('-')[0].trim()} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
              {category.title.split('-')[1]?.trim() || "VIP SEÇENEKLER"}
            </span>
          </h1>
          
          <div className="max-w-4xl">
            <p className="text-zinc-400 text-xl md:text-3xl font-black italic first-letter:uppercase leading-tight border-l-12 border-rose-600 pl-12">
              {category.description}
            </p>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-black text-white italic uppercase mb-8 border-l-4 border-rose-600 pl-4">
            Bu Kategorideki Aktif Şehirler
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cityKeys.map((key) => (
              <Link href={`/${key}`} key={key} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 group hover:border-rose-600/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-rose-600/50 text-[10px] font-black uppercase group-hover:text-rose-600">VIP AĞ</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-rose-600"></div>
                </div>
                <h3 className="text-white font-black italic uppercase text-xl group-hover:text-rose-500 transition-colors">{cities[key].name}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-24">
           <HybridProfileGrid 
             profiles={profiles} 
             locationName={category.shortTitle}
             category={slug}
           />
        </section>

        <section className="bg-zinc-950/80 border border-zinc-900 rounded-[3rem] p-10 md:p-16 mb-24 relative overflow-hidden backdrop-blur-3xl">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/5 blur-[150px] rounded-full -z-10"></div>
           
           <h2 className="text-3xl font-black italic uppercase text-rose-500 mb-12">
             Elit ANSIKLOPEDİ // KATEGORİ İNCELEMESİ
           </h2>
           
           <SecureHTML 
             className="prose prose-invert max-w-none prose-p:text-xl md:prose-p:text-2xl prose-p:leading-relaxed prose-p:italic prose-p:font-medium prose-p:text-zinc-300 prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white prose-strong:text-rose-600"
             html={seoContent.replace(/\n\n/g, '<br/><br/>')}
           />
        </section>

        <PanicButton />
      </main>
    </div>
  );
}
