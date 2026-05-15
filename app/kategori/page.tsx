import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar";
import { taxonomyCategories } from "@/lib/taxonomy";
import { Shield, Target, Zap, Crown, Flame, Gem, Sparkles, UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "🛡️ Elite Niche & Kategoriler | EscortVIP Elit Protocol",
  description: "Türkiye'nin en seçkin escort ve partner kategorileri. GFE, BDSM, Slav VIP, Olgun ve daha fazlası için VIP rehberi.",
};

const iconMap: Record<string, any> = {
  "Elit": Crown,
  "Premium": Flame,
  "Prestij": Target,
  "premium": Gem
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <header className="mb-32 text-center relative">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[200px] rounded-full -z-10 animate-pulse"></div>
          
          <div className="inline-flex items-center gap-3 bg-zinc-950 px-6 py-2 rounded-full border border-zinc-900 text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase mb-8">
            <Shield className="w-3 h-3" />
            CLASSIFIED DIRECTORY
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter uppercase mb-6 leading-[0.8]">
            NIŞ <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-400">EVRENI</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-zinc-500 italic max-w-3xl mx-auto font-medium">
            Elit Network üzerinde tanımlanmış, her biri ayrı bir tutku dünyasını temsil eden elite kategorileri keşfedin.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(taxonomyCategories).map(([slug, cat]) => {
            const Icon = iconMap[cat.tier] || Sparkles;
            return (
              <Link 
                key={slug} 
                href={`/kategori/${slug}`}
                className="group relative bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900/50 rounded-[3rem] p-10 overflow-hidden hover:border-rose-600 transition-all duration-700 block"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/5 blur-3xl group-hover:bg-rose-600/15 transition-colors"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-16 rounded-2xl border border-rose-600/20 bg-black flex items-center justify-center text-rose-600 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-glow-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic">
                      {cat.tier} Tier
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-rose-500 transition-colors mb-4 leading-none">
                      {cat.shortTitle}
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed italic line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-900/50">
                    <span className="text-[10px] font-black tracking-widest text-white uppercase italic">İncele</span>
                    <div className="h-px flex-1 bg-zinc-900"></div>
                    <Zap className="w-4 h-4 text-rose-600 group-hover:animate-bounce" />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* CTA SECTION */}
        <section className="mt-40 bg-linear-to-b from-zinc-950 to-black p-12 md:p-24 rounded-[4rem] border border-zinc-900 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-rose-600/5 opacity-30 blur-3xl"></div>
           <h2 className="text-4xl md:text-6xl font-black italic uppercase italic mb-8 relative z-10 tracking-tighter">
             Aradığın Nişi <span className="text-rose-600">Bulamadın mı?</span>
           </h2>
           <p className="text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto mb-12 italic font-medium relative z-10">
             Elit ağımız sürekli genişliyor. Özel talepleriniz veya bu ağa dahil olmak için protokollerimize göz atın.
           </p>
           <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10">
              <Link href="/katilim-protokolu" className="bg-white text-black font-black py-5 px-10 rounded-full text-sm uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3">
                <UserPlus className="w-5 h-5" />
                Ağa Katıl
              </Link>
              <Link href="/ansiklopedi" className="border border-zinc-800 text-zinc-400 font-black py-5 px-10 rounded-full text-sm uppercase tracking-widest hover:border-rose-600 hover:text-white transition-all">
                Lügatı Keşfet
              </Link>
           </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 text-center mt-20 opacity-40">
        <div className="text-[10px] font-black tracking-[1em] text-zinc-500 uppercase italic">
          Prestij DIRECTORY PROTOCOL // 2026
        </div>
      </footer>
    </div>
  );
}
