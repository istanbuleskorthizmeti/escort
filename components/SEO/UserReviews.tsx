import React from 'react';
import { Star } from 'lucide-react';

interface UserReviewsProps {
  locationName: string;
  ratingValue: string;
  reviewCount: string;
}

export function UserReviews({ locationName, ratingValue, reviewCount }: UserReviewsProps) {
  const reviews = [
    {
      author: 'Kaan T***',
      date: '2026-05-18',
      rating: 5,
      comment: `${locationName} bölgesinde sundukları hizmet gerçekten kusursuzdu. Tamamen kaporasız ve görsellerle birebir aynı partner. Kesinlikle tavsiye ederim.`
    },
    {
      author: 'Mert A***',
      date: '2026-05-12',
      rating: 5,
      comment: 'Gizlilik ve güvenlik konusunda son derece profesyoneller. Gelen hanımefendi harikaydı, hiç düşünmeden arayabilirsiniz.'
    }
  ];

  return (
    <section className="relative glass-card p-12 rounded-[3rem] border border-rose-600/10 mt-20 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-600/30 to-transparent" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Rating Summary Left Panel */}
        <div className="lg:col-span-4 text-center lg:text-left space-y-6">
          <div className="space-y-2">
            <span className="text-rose-600 font-black text-xs tracking-[0.4em] uppercase italic block">Kullanıcı Değerlendirmeleri</span>
            <h3 className="text-white text-3xl font-black uppercase tracking-tighter italic">Müşteri Yorumları</h3>
          </div>
          
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black text-white italic tracking-tighter leading-none">{ratingValue}</span>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">5 Üzerinden Derecelendirme</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-medium italic">
              Toplam <span className="text-white font-bold">{reviewCount}</span> doğrulanmış geri bildirim.
            </p>
          </div>
        </div>

        {/* Reviews List Right Panel */}
        <div className="lg:col-span-8 space-y-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl space-y-4 hover:border-rose-600/20 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-600/10 border border-rose-600/20 flex items-center justify-center">
                    <span className="text-rose-600 font-black italic text-xs">{rev.author.slice(0, 1)}</span>
                  </div>
                  <div>
                    <h5 className="text-white text-sm font-black tracking-wider uppercase italic">{rev.author}</h5>
                    <span className="text-[9px] text-zinc-500 font-bold tracking-widest block">{rev.date}</span>
                  </div>
                </div>
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400 font-medium italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
