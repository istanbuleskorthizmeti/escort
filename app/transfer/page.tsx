import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ThemeEngine } from "@/lib/theme-engine";
import Navbar from "@/components/UI/Navbar";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { GlobalTagCloud } from "@/components/SEO/GlobalTagCloud";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "vipescorthizmeti.com";
  const theme = ThemeEngine.getTheme(host);
  
  return {
    title: `Havalimanı VIP Transfer ve Özel Şoförlü Karşılama | ${theme.brandName}`,
    description: `İstanbul Sabiha Gökçen ve Yeni Havalimanı özel şoförlü VIP transfer hizmetleri. Zırhlı araçlarla otele intikal ve lüks partner eşliği (Meet & Greet) standartları.`,
    keywords: "havalimanı vip transfer, sabiha gökçen lüks karşılama, özel şoförlü vip escort, gizli otel intikali, marina yat transferi, premium eşlik",
    alternates: {
      canonical: `https://${host}/transfer`,
    }
  };
}

export default async function TransferPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "vipescorthizmeti.com";
  const theme = ThemeEngine.getTheme(host);

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-[var(--brand-color)] selection:text-white">
      <Navbar />
      
      {/* 🚀 HERO SECTION (LOGISTICS CAMOUFLAGE) */}
      <section className="relative pt-32 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-zinc-900/40 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-color)] animate-pulse" />
              7/24 Operasyon Merkezi
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-[1.1]">
              <span className="text-[var(--brand-color)]">VIP Transfer</span> ve Gizli İntikal Yönetimi
            </h1>
            
            <p className="text-xl text-zinc-400 font-medium max-w-2xl">
              İstanbul Havalimanı, Sabiha Gökçen, Galataport ve özel marinalarda <strong className="text-white">özel şoförlü lüks araçlarla</strong> karşılama ve otele intikal hizmeti. İş seyahatlerinizde size <strong className="text-[var(--brand-color)]">bilingual (iki dil bilen) premium elit partnerlerimiz</strong> eşlik eder.
            </p>
            
            <div className="pt-6 flex flex-wrap gap-4">
              <Link 
                href="/tg?ref=transfer_hero"
                className="bg-[var(--brand-color)] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_var(--brand-color)]"
              >
                Transfer Rezerve Et
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ CORE SERVICES MATRIX */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-[var(--brand-color)] transition-colors group">
              <div className="w-12 h-12 bg-black rounded-xl border border-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🛩️
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-3">Tarmac Meet & Greet</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Özel jetiniz piste teker koyduğu anda başlayan operasyon. Sivil havacılık standartlarıyle uçak altı karşılama ve VIP lounge intikali. İsteğe bağlı olarak <strong className="text-zinc-200">iki dil bilen hostes partnerlerimiz</strong> tüm check-in süreçlerinizi yönetir.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-[var(--brand-color)] transition-colors group">
              <div className="w-12 h-12 bg-black rounded-xl border border-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🚘
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-3">Zırhlı Araç Filosu</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Maybach, Mercedes V-Class ve zırhlı SUV filomuzla İstanbul trafiğinden tamamen izole bir seyahat. Tam mahremiyet (Zero-Footprint) prensibiyle, <strong className="text-zinc-200">özel şoförlü vip escort</strong> hizmetlerimiz kusursuzca birleştirilir.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-[var(--brand-color)] transition-colors group">
              <div className="w-12 h-12 bg-black rounded-xl border border-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🛥️
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-3">Marina & Yat Organizasyonu</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Kalamış Marina, Galataport ve Ataköy lokasyonlarından özel yata geçiş asistanlığı. Boğaz turlarında size ve misafirlerinize prestij katacak <strong className="text-zinc-200">lüks escort transfer</strong> ve gece boyu premium eşlik standartları.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🕵️ SEO & SEMANTIC CONTENT LAYER (Invisible to UX, Visible to Bots via SSR) */}
      <section className="py-16 border-t border-zinc-900 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-lg font-bold text-zinc-600 mb-4 uppercase">Lojistik ve Mahremiyet Politikası</h2>
          <article className="prose prose-invert prose-p:text-zinc-500 prose-p:text-xs prose-p:leading-relaxed prose-p:text-justify max-w-none">
            <p>
              İstanbul'un karmaşık lojistik altyapısında, VIP konukların havalimanından veya marinalardan kalacakları otellere güvenli intikali büyük önem taşır. Sabiha Gökçen havalimanı vip escort transfer veya Zorlu Center lüks araç karşılama taleplerinizde, {theme.brandName} güvencesi altındasınız. 
            </p>
            <p>
              Operasyonlarımızın temeli, %100 gizlilik prensibine dayanır. İster kurumsal bir toplantı için özel şoförlü vip escort kiralama, ister özel bir tekne partisi için elit partner eşliği olsun, ajansımız tüm süreçleri profesyonelce yönetir. Kaporasız lüks transfer ve doğrulanmış profillerle, şehirdeki prestijinizi garanti altına alıyoruz.
            </p>
          </article>
        </div>
      </section>
      
      <GlobalTagCloud currentHost={host} />
      <UltraFooter host={host} cityName="İstanbul" />
    </main>
  );
}
