import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Star, ChevronRight } from 'lucide-react';
import { ElitEvents } from '@/lib/events';

export const metadata = {
  title: "2026 VIP Etkinlik Takvimi | Escortvip Elit Hub",
  description: "Türkiye'nin en seçkin etkinlikleri, konserleri ve spor organizasyonları için VIP eşlik rehberi. 2026 yılı tüm mega etkinlikler burada.",
};

export default function EventsIndexPage() {
  const categories = Array.from(new Set(ElitEvents.map(e => e.category)));

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6 bg-linear-to-r from-white via-rose-600 to-zinc-800 bg-clip-text text-transparent">
            2026 VIP Takvimi
          </h1>
          <p className="text-zinc-500 text-xl font-medium max-w-2xl mx-auto italic">
            Elit Monarch ağının 2026 yılı global etkinlik ve yüksek trafikli organizasyon rehberi.
          </p>
        </header>

        {/* CATEGORY FILTERS (Visual only for now) */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <span key={cat} className="px-6 py-2 bg-zinc-950 border border-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 border-zinc-800">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ElitEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
            <Link 
              key={event.slug} 
              href={`/etkinlik/${event.slug}`}
              className="group bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 hover:border-rose-600 transition-all duration-500 relative overflow-hidden"
            >
              {/* PRIORITY TAG */}
              {event.priority <= 2 && (
                <div className="absolute top-8 right-8 bg-rose-600 text-[8px] font-black uppercase px-3 py-1 rounded-full italic tracking-widest italic antialiased ring-4 ring-rose-600/20">
                  Critical Event
                </div>
              )}

              <div className="flex items-center gap-3 text-rose-600 mb-6 font-black italic uppercase text-xs tracking-widest">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-rose-600 transition-colors leading-tight">
                {event.title}
              </h2>

              <div className="flex items-center gap-2 text-zinc-500 mb-8 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                <span>{event.city.toUpperCase()} {event.venue && `| ${event.venue}`}</span>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3 italic opacity-70">
                {event.description}
              </p>

              <div className="flex items-center gap-2 text-rose-600 font-black italic uppercase text-[10px] tracking-[0.2em]">
                VIP Detaylarını Gör <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
