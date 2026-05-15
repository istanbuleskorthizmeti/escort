import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Shield, Star, Users, Trophy } from 'lucide-react';
import { ElitEvents } from '@/lib/events';
import { getStitchedContent } from '@/lib/obsidian-fragments';

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return ElitEvents.map((event) => ({
    slug: event.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = ElitEvents.find(e => e.slug === slug);
  if (!event) return {};

  return {
    title: `${event.title} VIP Eşlik Rehberi | Escortvip Elit Hub`,
    description: `${event.date} tarihindeki ${event.title} için özel VIP escort rehberi. ${event.city} bölgesinde lüks ve elit eşlik hizmetlerimizle etkinliğin tadını çıkarın.`,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = ElitEvents.find(e => e.slug === slug);

  if (!event) notFound();

  // Seed with event title for consistent content
  const seed = event.title.length * 777;
  const seoContent = getStitchedContent(seed, 3000);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-radial-at-t from-rose-900/20 to-black pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-full px-6 py-2 mb-8 animate-pulse shadow-glow">
            <Trophy className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">VIP Event Hub</span>
          </div>

          <h1 className="text-5xl lg:text-9xl font-black italic uppercase tracking-tighter mb-8 bg-linear-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent leading-[0.9]">
            {event.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-8 text-zinc-400 font-black italic uppercase text-sm tracking-widest mt-12">
            <div className="flex items-center gap-2 border-l-2 border-rose-600 pl-4">
              <Calendar className="w-5 h-5 text-rose-600" />
              <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 border-l-2 border-rose-600 pl-4">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>{event.city.toUpperCase()} {event.venue && `| ${event.venue}`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* MAIN SEO CONTENT */}
        <div className="lg:col-span-8">
          <div className="prose prose-invert prose-2xl max-w-none">
             <div className="flex items-center gap-6 mb-16">
               <h2 className="text-4xl font-black text-white italic uppercase tracking-widest border-l-8 border-rose-600 pl-8 m-0">Güzelliğin Ve Gücün Zirvesi</h2>
               <div className="flex-1 h-px bg-zinc-900"></div>
             </div>

             <div className="text-zinc-500 font-medium leading-[1.8] italic text-justify whitespace-pre-line antialiased first-letter:text-7xl first-letter:font-black first-letter:text-rose-600 first-letter:mr-3 first-letter:float-left">
               {seoContent}
             </div>
          </div>
        </div>

        {/* SIDEBAR: EVENT STATS & CTA */}
        <div className="lg:col-span-4 space-y-12">
          <div className="sticky top-40 space-y-8">
            <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[3.5rem] shadow-3xl shadow-rose-900/5">
              <h3 className="text-2xl font-black italic uppercase text-white mb-8 border-b border-zinc-900 pb-6">Etkinlik Protokolü</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="bg-rose-600/10 p-2 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Tam Gizlilik Güvenlik</h4>
                    <p className="text-[10px] text-zinc-500 italic">Etkinlik çevresinde tam gizlilik ve anonimlik garantisi.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="bg-rose-600/10 p-2 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">VIP Karşılama</h4>
                    <p className="text-[10px] text-zinc-500 italic">Stat veya konser alanına yakın özel lokasyonlarda buluşma.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="bg-rose-600/10 p-2 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Kısıtlı Kontenjan</h4>
                    <p className="text-[10px] text-zinc-500 italic">Etkinlik yoğunluğu sebebiyle sınırlı Premium profil erişimi.</p>
                  </div>
                </li>
              </ul>

              <Link 
                href={`/${event.city}`} 
                className="mt-12 block w-full bg-rose-600 py-6 rounded-2xl text-center text-xs font-black uppercase tracking-[0.3em] italic hover:bg-white hover:text-rose-600 transition-all shadow-glow"
              >
                HEMEN REZERVE ET
              </Link>
            </div>

            {/* RELATED CITIES/NICHE CTA */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/kategori/vip-masaj-terapisi" className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl hover:border-rose-600 transition-all text-center">
                 <span className="text-[8px] font-black uppercase text-zinc-500 block mb-2 tracking-widest">Maç Sonrası</span>
                 <span className="text-xs font-black italic uppercase text-white">VIP Masaj</span>
              </Link>
              <Link href="/kategori/gfe-sevgili-deneyimi" className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl hover:border-rose-600 transition-all text-center">
                 <span className="text-[8px] font-black uppercase text-zinc-500 block mb-2 tracking-widest">Konaklamalı</span>
                 <span className="text-xs font-black italic uppercase text-white">GFE Üyeliği</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="bg-zinc-950 py-24 border-t border-zinc-900 mt-40">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-black italic uppercase mb-8">Etkinlikler Bitmeden Yerinizi Ayırtın</h2>
          <p className="text-zinc-500 text-sm italic mb-12">
            Mega organizasyonlar sırasında yaşanan talep yoğunluğu sebebiyle, en asil profillerimizi önceden rezerve etmenizi öneririz.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/etkinlikler" className="border-b border-rose-600 text-rose-600 font-black italic p-2 hover:bg-rose-600 hover:text-white transition-all uppercase text-[10px] tracking-widest">
               Tüm Takvimi Gör
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
