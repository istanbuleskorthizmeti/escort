"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Trophy } from 'lucide-react';
import { ElitEvents } from '@/lib/events';

interface EventAwareBannerProps {
  citySlug: string;
}

export default function EventAwareBanner({ citySlug }: EventAwareBannerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Find current or upcoming events for this city
  const cityEvents = ElitEvents
    .filter(e => e.city === citySlug)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (cityEvents.length === 0) return null;

  const nextEvent = cityEvents[0];
  const eventDate = new Date(nextEvent.date);
  const now = new Date();
  const isSoon = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < 30;

  if (!isSoon) return null;

  return (
    <div className="relative group overflow-hidden bg-zinc-950 border border-rose-600/30 rounded-[2.5rem] p-8 mb-16 shadow-2xl shadow-rose-900/10">
      <div className="absolute inset-0 bg-radial-at-t from-rose-900/10 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-rose-600 p-4 rounded-2xl text-white shadow-glow">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 italic">VIP Event Hub</span>
              <div className="w-1 h-1 bg-rose-600 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white leading-tight">
              {nextEvent.title}
            </h3>
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
              <Calendar className="w-3 h-3" />
              <span>{eventDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
              <span>• {nextEvent.venue || citySlug.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <Link 
          href={`/etkinlik/${nextEvent.slug}`}
          className="bg-white text-black px-8 py-4 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
        >
          DETAYLARI GÖR <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* DECORATIVE DOTS */}
      <div className="absolute top-2 right-8 flex gap-1">
         {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-rose-600/20 rounded-full"></div>)}
      </div>
    </div>
  );
}
