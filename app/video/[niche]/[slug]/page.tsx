import React from 'react';
import { Metadata } from 'next';
import { ADULT_RACES, ADULT_CATEGORIES, ADULT_QUALITIES, ADULT_TAGS, generateAggressiveKeywords } from '@/lib/niche-matrix';
import { generateIstanbulAggressiveMetadata, ISTANBUL_DISTRICTS } from '@/lib/istanbul-aggressive-seo';
import { siteConfig } from '@/config/site';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { niche, slug } = await params;
  const decodedNiche = decodeURIComponent(niche).toUpperCase();
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ').toUpperCase();
  
  const isIstanbul = decodedSlug.includes('ISTANBUL') || ISTANBUL_DISTRICTS.some(d => decodedSlug.includes(d.toUpperCase()));
  
  if (isIstanbul) {
    const istanbulMeta = generateIstanbulAggressiveMetadata(decodedSlug);
    return {
      title: istanbulMeta.title,
      description: istanbulMeta.description,
      keywords: istanbulMeta.keywords,
      robots: 'index, follow',
    };
  }

  const keywords = generateAggressiveKeywords(decodedNiche, decodedSlug);

  return {
    title: `🔞 ${decodedSlug} ${decodedNiche} | ${ADULT_QUALITIES[0]} ${ADULT_TAGS[4]} İZLE`,
    description: `${decodedSlug} bölgesine özel ${decodedNiche} porno videoları, ${ADULT_QUALITIES[1]} sansürsüz klipler ve en iyi ${ADULT_TAGS[0]} sahneleri bedava izle.`,
    keywords: keywords.join(', '),
    robots: 'index, follow',
    openGraph: {
      title: `${decodedSlug} ${decodedNiche} Porn Tube`,
      description: `Watch free ${decodedNiche} porn videos in ${decodedSlug}.`,
      type: 'video.other'
    }
  };
}

export default async function VideoPage({ params }: any) {
  const { niche, slug } = await params;
  const decodedNiche = decodeURIComponent(niche).toUpperCase();
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ').toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-red-600">
      {/* NUCLEAR HEADER */}
      <header className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-red-600">EXX<span className="text-white">VIDEOS</span></h1>
        <div className="flex gap-4">
          <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase italic">LIVE NOW</span>
          <span className="bg-zinc-800 px-3 py-1 rounded text-[10px] font-black uppercase">18+ ONLY</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* VIDEO PLAYER PLACEHOLDER (HIGH CONVERSION) */}
        <section className="mb-12">
          <div className="aspect-video w-full bg-zinc-900 rounded-3xl relative overflow-hidden group cursor-pointer border-4 border-zinc-800 hover:border-red-600/50 transition-all shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic drop-shadow-lg">{decodedSlug} - {decodedNiche} SANSÜRSÜZ FULL HD</h2>
            </div>
          </div>
        </section>

        {/* AGGRESSIVE KEYWORD CLOUD */}
        <section className="mb-20">
          <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6">En Popüler VIP Kategoriler</h3>
          <div className="flex flex-wrap gap-3">
            {ADULT_CATEGORIES.map((c, i) => (
              <span key={i} className="bg-zinc-950 border border-zinc-900 px-4 py-2 rounded-full text-xs font-bold hover:border-red-600 transition-colors">#{c.toUpperCase()}</span>
            ))}
            {ADULT_RACES.map((r, i) => (
              <span key={i} className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-full text-xs font-bold text-red-500 italic">#{r.toUpperCase()} PORNO</span>
            ))}
          </div>
        </section>

        {/* NUCLEAR BACKLINK SECTION (SEO JUICE) */}
        <section className="mb-20 p-8 bg-zinc-950 border border-red-600/20 rounded-3xl">
           <h4 className="text-xl font-black uppercase italic text-red-600 mb-6">🛡️ %100 DOĞRULANMIŞ PARTNER REHBERİ</h4>
           <div className="grid grid-cols-1 gap-6">
              <a href="https://istanbulescort.blog" className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-red-600 transition-all flex flex-col items-center text-center">
                 <span className="block text-white font-black text-2xl mb-2 group-hover:text-red-500 tracking-tighter">VİP ESCORT KATALOĞU</span>
                 <span className="text-zinc-500 text-sm font-bold max-w-lg">Türkiye'nin en seçkin kaporasız escort bayan ilanları ve gerçek görselli elit partner rehberi.</span>
              </a>
           </div>
        </section>

        {/* LONG FORM SEO CONTENT (KEYWORD STUFFING) */}
        <article className="prose prose-invert max-w-none text-zinc-400 text-lg leading-relaxed">
          <h2 className="text-white font-black text-3xl mb-8 uppercase italic border-l-8 border-red-600 pl-6">
            {decodedSlug} Bölgesinde En İyi {decodedNiche} Deneyimi
          </h2>
          
          {ISTANBUL_DISTRICTS.some(d => decodedSlug.includes(d.toUpperCase())) && (
            <div className="mb-10 p-6 bg-red-600/5 border border-red-600/20 rounded-2xl italic text-red-500 font-bold">
               ÖNEMLİ: {decodedSlug} bölgesinde kaporasız hizmet veren tek gerçek {decodedNiche} ve escort ajansıyız. 
               Beşiktaş, Şişli, Kadıköy ve tüm İstanbul ilçelerinde 7/24 aktif kadromuzla hizmetinizdeyiz.
            </div>
          )}

          <p>
            Türkiye'nin ve dünyanın en seçkin {decodedNiche} porno arşivi artık parmaklarınızın ucunda. 
            {decodedSlug} lokasyonuna özel olarak optimize edilmiş video kanalımızda; {ADULT_QUALITIES[0]} kalitesinde sansürsüz klipler, 
            {ADULT_CATEGORIES[0]} ve {ADULT_CATEGORIES[1]} gibi popüler nişlerde binlerce içerik sizi bekliyor.
          </p>
          <p>
            İstanbul'un kalbi olan {decodedSlug} semtinde gerçek bir deneyim arıyorsanız, <a href="https://istanbulescort.blog" className="text-red-600 font-black underline">İstanbul Escort</a> ağımızdaki profesyonelleri inceleyebilirsiniz. 
            Her gün güncellenen {ADULT_TAGS[0]} ve {ADULT_TAGS[1]} listelerimizle, aradığınız o limitsiz tutkuya kaporasız ve ücretsiz ulaşın. 
            {decodedNiche} kategorisindeki en yeni {ADULT_TAGS[2]} sahneleri ve {ADULT_TAGS[3]} altyazılı seçenekleriyle keyfinizi zirveye taşıyın.
          </p>
        </article>
      </div>

      {/* STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-600 text-black text-center font-black uppercase italic tracking-widest z-50">
        🔞 DİREKT WHATSAPP DESTEK HATTI: <a href="https://dorukcanay.digital" className="underline hover:text-white">TIKLA VE ARA</a> 🔞
      </div>
    </main>
  );
}
