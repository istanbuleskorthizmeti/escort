import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";

export const metadata: Metadata = {
  title: "🛡️ Elit Külliyat | EscortVip Bilgi ve Otorite Arşivi",
  description: "Lüks eşlik dünyasının sarsılmaz etik kuralları, biyo-hacking standartları ve psikoseksüel derinliğine dair profesyonel makaleler arşivi.",
};

export default function BlogHubPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      {/* Görünmez CollectionPage Şeması */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "EscortVIP Elit Makaleleri",
            description: "Güvenlik, gizlilik ve VIP rezervasyon detayları üzerine makaleler arşivi.",
            url: "https://vipescorthizmeti.com/blog"
          })
        }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <section className="relative mb-24">
          <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-rose-600/10 blur-[200px] rounded-full -z-10"></div>
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full mb-6">
            KÜLLİYAT // Elit ARCHIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] italic uppercase">
            EscortVIP <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300">
              OKUMA PROTOKOLÜ
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-3xl border-l-4 border-rose-600 pl-6">
            Lüks eşlik, sınır tanımayan fanteziler ve Sıfır-İz (Tam Gizlilik) rezervasyon rehberi hakkında sektörel analizler.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group relative bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden hover:border-rose-600/50 transition-all duration-700 flex flex-col"
            >
              <div className="absolute inset-0 bg-linear-to-t from-zinc-900/50 to-transparent z-0 group-hover:bg-rose-900/5 transition-colors"></div>
              
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex gap-2 flex-wrap mb-6">
                  <span className="text-[9px] font-black tracking-widest uppercase bg-zinc-900 text-rose-500 px-3 py-1 rounded-sm border border-rose-900/30">
                    {post.category}
                  </span>
                  <span className="text-[9px] font-black tracking-widest uppercase bg-zinc-900 text-zinc-500 px-3 py-1 rounded-sm border border-zinc-800">
                    {post.date}
                  </span>
                </div>
                
                <div className="grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-500 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 grow">
                  {post.excerpt}
                </p>
                </div>

                <div className="pt-6 border-t border-zinc-900 flex justify-between items-center mt-auto">
                   <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{post.author}</div>
                   <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                     →
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950/80 text-center px-10">
         <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            Elit ARCHITECTURE // VIPESCORTHIZMETI.COM
         </div>
      </footer>
    </div>
  );
}
