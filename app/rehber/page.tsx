import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { blogPosts } from "@/lib/blog-data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "⭐ VIP Escort & İstanbul Elit Eskort Rehberi | VIPESCORTHIZMETI.COM",
  description: "Türkiye'nin en seçkin escort bayan profilleri, İstanbul VIP escort hizmetleri, elit eskort rehberi ve kaporasız escort ilanları. 2026 güncel eskort listesi.",
  keywords: [
    "escort",
    "vip escort transfer",
    "istanbul escort",
    "vip escort",
    "elit escort",
    "kaporasız escort",
    "rus escort",
    "üniversiteli escort",
    "sarışın escort",
    "istanbul elit escort bayan",
    "vip escort rehberi",
    "mutlu son masaj",
    "istanbul mutlu son",
    "ankara vip escort",
    "izmir elit eşlik",
    "gerçek escort profilleri",
    "mutlu son deneyimi",
    "lüks konaklama rehberi",
    "gece hayatı",
    "escort ilanları",
    "vip partner",
    "masaj salonu",
    "mutlu son masaj istanbul"
  ],
  alternates: {
    canonical: `https://vipescorthizmeti.com/rehber`,
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

const PROTOCOL_NUMBERS = ["01", "02", "03"];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased overflow-x-hidden">
      {/* STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "İstanbul VIP Escort Yaşam ve Hizmet Rehberi",
            description: "İstanbul escort, elit eskort ve VIP escort hizmetleri üzerine otoriter rehber. %100 gerçek profiller ve kaporasız hizmet.",
            url: "https://vipescorthizmeti.com/rehber",
            publisher: {
              "@type": "Organization",
              name: "VIPESCORTHIZMETI.COM",
              url: "https://vipescorthizmeti.com"
            }
          }),
        }}
      />

      <Navbar />

      <main>
        {/* CINEMATIC HERO — tekil full-screen açılış */}
        <section className="relative min-h-screen flex flex-col justify-end px-8 md:px-20 pb-24 overflow-hidden">
          {/* Arka plan degrade deseni */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,29,72,0.15),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(225,29,72,0.08),transparent_50%)]"></div>
          {/* Dikey dekoratif çizgiler */}
          <div className="absolute inset-0 overflow-hidden opacity-5">
            <div className="absolute top-0 bottom-0 w-px bg-zinc-400 left-[16.66%]"></div>
            <div className="absolute top-0 bottom-0 w-px bg-zinc-400 left-[33.32%]"></div>
            <div className="absolute top-0 bottom-0 w-px bg-zinc-400 left-[49.98%]"></div>
            <div className="absolute top-0 bottom-0 w-px bg-zinc-400 left-[66.64%]"></div>
            <div className="absolute top-0 bottom-0 w-px bg-zinc-400 left-[83.30%]"></div>
          </div>
          {/* Büyük arka plan metni */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black italic text-zinc-950 select-none pointer-events-none leading-none whitespace-nowrap">
            ESCORT
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-3 h-3 bg-rose-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.8)]"></div>
              <span className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase italic">VIP ESCORT PROTOKOLÜ AKTİF</span>
            </div>
            <h1 className="text-[13vw] md:text-[10vw] font-black italic uppercase tracking-tighter leading-[0.85] mb-16">
              İSTANBUL<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">ESCORT</span>
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
              <p className="text-zinc-400 text-xl md:text-3xl font-black italic lowercase first-letter:uppercase leading-tight max-w-2xl border-l-8 border-rose-600 pl-10">
                İstanbul&apos;un seçkin VIP escort standartlarını belirleyen profesyonel rehberlik ve gerçek eskort profilleri.
              </p>
              <div className="flex items-center gap-6 text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase whitespace-nowrap">
                <span>{blogPosts.length} VIP DOSYA</span>
                <div className="w-12 h-px bg-zinc-800"></div>
                <span>ESCORT GÜNCELLEMESİ</span>
              </div>
            </div>
          </div>
          {/* Scroll indicator */}
          <div className="absolute bottom-10 right-10 flex flex-col items-center gap-4 opacity-30">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase italic rotate-90 origin-center">SCROLL</span>
            <div className="w-px h-16 bg-zinc-600"></div>
          </div>
        </section>

        {/* PROTOKOL LİSTESİ — horizontal numbered layout */}
        <section className="max-w-7xl mx-auto px-8 md:px-20 py-32">
          <div className="space-y-0 divide-y divide-zinc-900">
            {blogPosts.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row items-start md:items-center gap-8 py-16 hover:bg-zinc-950/50 transition-all duration-700 px-8 -mx-8 rounded-3xl"
              >
                {/* Numara */}
                <span className="text-[80px] md:text-[120px] font-black italic text-zinc-900 group-hover:text-rose-600/20 transition-colors leading-none min-w-[160px] text-right hidden md:block">
                  {PROTOCOL_NUMBERS[idx] ?? `0${idx + 1}`}
                </span>

                {/* İçerik */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[9px] font-black tracking-[0.5em] text-rose-600 uppercase italic border border-rose-600/30 px-4 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase italic">{post.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-rose-600 transition-colors leading-none">
                    {post.title.includes("Escort") ? post.title : `${post.title} | VIP Escort`}
                  </h2>
                  <p className="text-zinc-500 text-lg italic font-medium leading-relaxed lowercase first-letter:uppercase max-w-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-2 group-hover:translate-y-0">
                    {post.excerpt}
                  </p>
                </div>

                {/* Ok */}
                <div className="w-20 h-20 rounded-full border border-zinc-800 group-hover:border-rose-600 group-hover:bg-rose-600 flex items-center justify-center transition-all duration-500 text-2xl font-black shrink-0">
                  →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* GİZLİLİK PROTOKOLÜ — tam ekran spotlight section */}
        <section className="relative bg-zinc-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.12),transparent_70%)]"></div>
          <div className="max-w-7xl mx-auto px-8 md:px-20 py-40 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="text-[9px] font-black tracking-[0.6em] text-rose-600 uppercase italic">ESCORT GİZLİLİK</div>
                <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                  VİP ESCORT<br />
                  <span className="text-rose-600">GÜVENCESİ</span>
                </h2>
                <p className="text-zinc-400 text-xl italic font-medium leading-relaxed lowercase first-letter:uppercase border-l-8 border-rose-600 pl-10">
                  Her İstanbul escort randevusu, sıfır iz prensibimiz ve uçtan uca şifreleme altyapımızla korunur.
                  Sektörün en katı gizlilik standartları, burada günlük pratiğin bir parçasıdır.
                </p>
                <Link href="/blog/vip-gizlilik-ve-guvenlik" className="inline-flex items-center gap-6 text-white font-black italic text-sm uppercase tracking-widest hover:text-rose-600 transition-colors group/cta">
                  <span>ESCORT PROTOKOLLERİNİ OKU</span>
                  <span className="w-12 h-px bg-current"></span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { stat: "VIP", label: "ESCORT DENEYİMİ" },
                  { stat: "%100", label: "GERÇEK PROFİL" },
                  { stat: "2026", label: "GÜNCEL LİSTE" },
                  { stat: "∞", label: "GİZLİLİK" },
                ].map((item, i) => (
                  <div key={i} className="bg-black border border-zinc-900 rounded-4xl p-10 text-center group hover:border-rose-600 transition-all duration-500">
                    <span className="text-5xl md:text-7xl font-black italic text-rose-600 block leading-none mb-4 drop-shadow-glow">{item.stat}</span>
                    <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RSS BANNER */}
        <section className="max-w-7xl mx-auto px-8 md:px-20 py-20">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-rose-600 transition-all duration-700">
            <div className="space-y-4">
              <div className="text-[9px] font-black tracking-[0.5em] text-rose-600 uppercase italic">CANLI ESCORT AKIŞI</div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">İSTANBUL ESCORT RSS</h3>
              <p className="text-zinc-500 text-sm italic">Tüm yeni escort bayan ilanları, ilçe ve mahalle güncellemeleri anlık RSS akışınıza iletilir.</p>
            </div>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-rose-600 hover:bg-white hover:text-black text-white font-black italic uppercase tracking-wider py-6 px-12 rounded-full transition-all duration-500 text-sm shadow-glow"
            >
              RSS&apos;E ABONE OL
            </a>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-20 pb-20">
          <div className="bg-zinc-950 border border-zinc-900 p-10 md:p-16 rounded-[3rem] text-zinc-600 text-[10px] font-black italic uppercase tracking-[0.2em] text-center">
            ESCORT REHBER İÇERİKLERİ, İSTANBUL ELİTE CONCIERGE NETWORK TARAFINDAN PERİYODİK OLARAK GÜNCELLENMEKTEDİR. © 2026 VIPESCORTHIZMETI.COM
          </div>
        </section>

        <PanicButton />
      </main>

      <footer className="py-40 border-t border-zinc-900 bg-zinc-950/80 text-center px-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto space-y-16">
          <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-[0.3em] uppercase">
            ISTANBUL ELITE ESCORT NETWORK
          </h2>
          <p className="text-zinc-600 text-md leading-loose lowercase first-letter:uppercase font-medium max-w-4xl mx-auto italic">
            vipescorthizmeti.com, İstanbul&apos;un tüm seçkin lokasyonlarında profesyonel escort rehberliği ve VIP eskort standartlarınin tek adresidir.
          </p>
          <div className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-20">
            ESCORT PROTOCOLS // ESTABLISHED 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
