import React from 'react';
import Link from 'next/link';
import { PlayCircle, Lock, Eye, AlertTriangle, ShieldAlert } from 'lucide-react';
import { API_HQ_DOMAIN } from '@/config/domains';

interface CloakerFrontendProps {
  districtName: string;
}

export function CloakerFrontend({ districtName }: CloakerFrontendProps) {
  const loc = districtName === "İSTANBUL" ? "İSTANBUL" : districtName.replace(/[-\u2013\u2014]/g, ' ').toUpperCase();

  // Fake Video Grid Items
  const fakeVideos = [
    { title: "TELEGRAM SIZINTISI - 18+ VİDEO 1", duration: "04:12", views: "142K" },
    { title: `${loc} VİLLA SKANDALI KAMERA KAYDI`, duration: "12:05", views: "89K" },
    { title: "ÜNLÜ İSMİN OTEL ODASI İFŞASI", duration: "08:45", views: "210K" },
    { title: "GİZLİ ÇEKİM SANSÜRSÜZ ARŞİV", duration: "24:30", views: "340K" },
  ];

  return (
    <div className="w-full relative bg-black min-h-screen text-white overflow-hidden py-24">
      {/* Dark Web / Red Glow Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-900/20 blur-[150px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Warning Banner */}
        <div className="bg-red-950/40 border border-red-600/30 rounded-2xl p-6 mb-16 flex flex-col md:flex-row items-center gap-6 animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.15)]">
           <ShieldAlert className="w-12 h-12 text-red-600 shrink-0" />
           <div>
              <h2 className="text-xl font-black text-red-500 uppercase tracking-widest mb-1">DİKKAT: YETİŞKİN İÇERİK (+18)</h2>
              <p className="text-zinc-400 text-sm font-medium">
                 Bu sayfadaki görüntüler {loc} bölgesinden sızdırılan özel Telegram kasetlerini içermektedir. Sansürsüz izlemek için yaşınızı doğrulayın veya elit ağa katılın.
              </p>
           </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-3 bg-red-950/50 border border-red-600/20 px-6 py-2 rounded-full mb-8">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">SON DAKİKA İFŞA ARŞİVİ</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] mb-6 text-white drop-shadow-2xl">
            {loc} <span className="text-red-600">SKANDALI</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-medium italic max-w-3xl mx-auto">
            Sosyetenin gizli sırları ve sızdırılan VIP kasetleri ilk kez sansürsüz yayında. 
          </p>
        </div>

        {/* Fake Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {fakeVideos.map((video, idx) => (
            <Link href={API_HQ_DOMAIN} key={idx} className="group relative block overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 hover:border-red-600/50 transition-all duration-500">
              {/* Fake Thumbnail Wrapper */}
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                {/* Simulated blurred background */}
                <div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-black opacity-80 group-hover:scale-110 transition-transform duration-700 blur-md"></div>
                
                {/* Red Glitch Overlay */}
                <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-md border border-red-600/30 group-hover:border-red-600 transition-colors shadow-glow-red">
                    <PlayCircle className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Video Info Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">SANSÜRSÜZ</span>
                   <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-md">{video.duration}</span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-md">
                   <Eye className="w-3 h-3" /> {video.views}
                </div>
              </div>

              {/* Title Section */}
              <div className="p-6">
                <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors italic uppercase tracking-tight mb-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                   <Lock className="w-4 h-4 text-red-600" /> Kilitli İçerik - İZLEMEK İÇİN TIKLA
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call To Action (Funnel) */}
        <div className="bg-linear-to-br from-red-950 to-black border border-red-900/50 rounded-[3rem] p-12 text-center relative overflow-hidden group">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-600/5 blur-[80px] group-hover:bg-red-600/10 transition-all duration-700 pointer-events-none" />
           <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
                BAŞKASINI İZLEMEYİ BIRAK, <br/><span className="text-red-600">KENDİ VİDEONU ÇEK!</span>
              </h3>
              <p className="text-zinc-400 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                Ekranda gördüğün yalan hayatları izlemek yerine lüksün ve elit eğlencenin merkezine katıl. 
                Gerçek ve Kaporasız VIP Escort deneyimi seni bekliyor.
              </p>
              <Link 
                href={API_HQ_DOMAIN}
                className="inline-block bg-red-600 text-white font-black uppercase tracking-[0.3em] px-12 py-5 rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]"
              >
                VIP AĞA KATIL VE DOĞRULA →
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
