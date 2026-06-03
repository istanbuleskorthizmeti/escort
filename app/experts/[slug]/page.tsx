import { experts } from "@/lib/experts";
import { notFound } from "next/navigation";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { Metadata } from "next";
import { SecureHTML } from "@/components/SecureHTML";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return experts.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const expert = experts.find((e) => e.slug === slug);
  if (!expert) {
    const formattedSlug = slug.replace(/-/g, ' ').toUpperCase();
    return { title: `👑 ${formattedSlug} OTORİTE PROFİLİ | VIP SEÇKİSİ | DRKCNAY` };
  }

  return {
    title: `🛡️ ${expert.name} | ${expert.title} | Elit Otorite Standartları`,
    description: `${expert.name} liderliğindeki ${expert.specialty} uzmanlığıyla; elite yaşam, biyo-hacking ve psikoseksüel derinlik üzerine %100 doğrulanmış bilimsel rehberlik.`,
    keywords: [
      `${expert.name}`,
      `${expert.title}`,
      "Elit otorite",
      "elite yaşam rehberi",
      "vip sağlık ve psikoloji",
    ],
  };
}

export default async function ExpertDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const expert = experts.find((e) => e.slug === slug);

  if (!expert) notFound();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-gold selection:text-black antialiased">
      {/* JSON-LD Schema Enjeksiyonu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": expert.schemaType,
            name: expert.name,
            jobTitle: expert.title,
            description: expert.bio,
            image: `https://vipescorthizmeti.com${expert.image}`,
            url: `https://vipescorthizmeti.com/experts/${expert.slug}`,
          }),
        }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-40">
          <div className="relative rounded-[4rem] overflow-hidden border border-zinc-900 bg-Prestij aspect-square">
             <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"></div>
             <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[15rem] font-serif italic">
                {expert.name[0]}
             </div>
          </div>

          <div className="space-y-12">
             <header>
                <div className="inline-block bg-zinc-950 border border-zinc-900 text-gold text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8">
                  DOGRULANMIS // {expert.schemaType.toUpperCase()}
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] italic uppercase font-serif">
                  {expert.name}
                </h1>
                <h2 className="text-xl md:text-3xl font-bold text-gold uppercase tracking-widest italic border-b-2 border-gold/20 pb-8 font-serif">
                  {expert.title}
                </h2>
             </header>

             <div className="prose prose-invert max-w-none">
                <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed italic border-l-4 border-gold pl-8">
                  {expert.bio}
                </p>
             </div>

             <div className="flex flex-wrap gap-4">
               {expert.specialty.split("&").map((s) => (
                 <span key={s} className="bg-zinc-900 px-6 py-2 rounded-full text-xs font-black tracking-widest text-gold border border-gold/10">
                   #{s.trim().toUpperCase()}
                 </span>
               ))}
             </div>
          </div>
        </section>

        <section className="space-y-24">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter border-b-4 border-gold pb-4 w-fit font-serif">
            Hizmet Modülleri // <span className="text-gold">THE ABSOLUTE CODES</span>
          </h2>

          <div className="space-y-40">
            {expert.modules.map((module) => (
              <article key={module.slug} className="group relative bg-Prestij border border-zinc-900 rounded-[4rem] p-12 md:p-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-gold/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 space-y-12">
                   <div className="text-[10px] font-black tracking-[0.8em] text-gold uppercase italic opacity-50">
                      Module ID: {module.slug.toUpperCase()}
                   </div>

                   <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none group-hover:text-gold transition-colors font-serif">
                     {module.title}
                   </h3>

                   <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em]">
                      {module.description}
                   </p>

                   <SecureHTML 
                     className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-p:text-lg md:prose-p:text-2xl prose-p:leading-relaxed prose-headings:font-serif prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter lg:prose-p:columns-2 lg:prose-p:gap-20"
                     html={module.content.replace(/\n/g, '<br/>')}
                   />

                   <div className="pt-12 border-t border-zinc-900 flex justify-between items-center text-[10px] font-black tracking-widest text-zinc-700 uppercase italic">
                      <span>Standart v1.0.26</span>
                      <span>{expert.name} Onaylı</span>
                   </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 bg-Prestij text-center px-10">
        <div className="text-[10px] font-black tracking-[1em] text-zinc-800 uppercase italic">
          Prestij ORACLE PROTOCOL // AUTHORIZED PERSONNEL ONLY
        </div>
      </footer>
    </div>
  );
}
