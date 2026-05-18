import Link from "next/link";
import { Metadata } from "next";
import { experts } from "@/lib/experts";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";

export const metadata: Metadata = {
  title: "🛡️ VIP Uzman Kadromuz | EscortVip Elit Partner & Mutlu Son Rehberi",
  description: "Eda Nur ve profesyonel ekibimizle; biyo-hacking, psikoseksüel derinlik ve elite escort rehberliği üzerine sarsılmaz bir otorite. Gerçek profiller, gerçek deneyimler.",
  keywords: [
    "vip escort rehberi",
    "mutlu son uzmanı",
    "elit partner rehberliği",
    "eda nur escortvip",
    "profesyonel eşlik eğitimi",
    "cinsel sağlık ve lüks yaşam",
    "vip partner standartları",
    "mutlu son deneyimi",
    "onaylı escort profilleri",
    "lüks gece hayatı uzmanı"
  ],
};

export default function ExpertsPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Otorite Konseyi | EscortVip Elit Uzman Kadromuz",
    "description": "Dr. DRKCNAY ve Eda Nur liderliğindeki uzman kadromuzla; biyo-hacking, psikoseksüel derinlik ve elite yaşam rehberliği üzerine bilimsel temelli sarsılmaz bir otorite.",
    "url": "https://vipescorthizmeti.com/experts",
    "hasPart": experts.map(expert => ({
      "@type": expert.schemaType,
      "name": expert.name,
      "jobTitle": expert.title,
      "description": expert.bio,
      "url": `https://vipescorthizmeti.com/experts/${expert.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-gold selection:text-black antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <header className="mb-24 relative">
          <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-gold/5 blur-[200px] rounded-full -z-10"></div>
          <div className="inline-block bg-zinc-950 border border-zinc-900 text-gold text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8">
            Elit COUNCIL // UZMAN OTORİTE
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.8] italic uppercase font-serif">
            Prestij <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              ORACLE
            </span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-3xl font-medium max-w-4xl border-l-4 border-gold pl-8 py-2">
            Cinselliğin biyolojik kodlarından ruhun derin arzularına kadar her şeyi bilimsel ve felsefi bir disiplinle ele alan elit kadromuzla tanışın.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-40">
          {experts.map((expert) => (
            <Link
              key={expert.id}
              href={`/experts/${expert.slug}`}
              className="group relative bg-Prestij border border-zinc-900 rounded-[3rem] overflow-hidden hover:border-gold transition-all duration-1000 flex flex-col"
            >
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"></div>
              
              <div className="relative h-[500px] w-full bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-zinc-800 transition-transform duration-1000 group-hover:scale-110">
                   <div className="w-full h-full flex items-center justify-center text-zinc-700 text-9xl font-serif italic">
                      {expert.name[0]}
                   </div>
                </div>
              </div>

              <div className="p-12 relative z-20 flex flex-col">
                <div className="text-xs font-black tracking-[0.4em] text-gold uppercase mb-4 border-b border-gold/20 pb-4 w-fit">
                  {expert.title}
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 group-hover:text-gold transition-colors font-serif">
                  {expert.name}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10 italic">
                  {expert.specialty}
                </p>
                <div className="flex items-center gap-4 text-xs font-black tracking-widest uppercase">
                  <span>PROTOKOLÜ İNCELE</span>
                  <div className="h-[2px] w-12 bg-gold group-hover:w-24 transition-all duration-700"></div>
                  <span className="text-gold">→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 md:p-24 text-center">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-widest mb-8 font-serif">
            Bilimsel Temelli <span className="text-gold">Elit</span> Yaklaşımı
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            EscortVIP kadrosu, sadece bir rehber değil, aynı zamanda yaşam standartlarınızı ve cinsel sağlığınızı optimize eden bir bilgi merkezidir. Her içerik, Dr. DRKCNAY ve Eda Nur&apos;un onayından geçerek en saf haliyle size sunulur.
          </p>
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
