import React from 'react';
import { Music, Calendar, MapPin, Star, ChevronRight, ShieldCheck, Users, Zap } from 'lucide-react';

export function VIPEventHub() {
  return (
    <section className="relative py-40 px-6 overflow-hidden bg-black">
      {/* 🔮 MASTER BACKGROUND FX */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-rose-600/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-600/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="glass-card rounded-[4rem] p-8 md:p-24 overflow-hidden border-rose-600/10 shadow-2xl relative group">
          <div className="absolute inset-0 bg-linear-to-br from-rose-600/[0.02] to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className="space-y-16">
              <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-4 bg-zinc-950/80 backdrop-blur-3xl border border-rose-600/30 px-8 py-3 rounded-full w-fit animate-fade-in shadow-glow-rose">
                  <Star className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-rose-600 italic">ISTANBUL VIP EVENT HUB // 2026</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-[0.8] drop-shadow-2xl">
                    SCORPIONS GLOBAL <br/>
                    <span className="text-rose-600 drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">TOUR İSTANBUL</span>
                  </h2>
                  <p className="text-zinc-500 text-lg font-bold italic tracking-wide max-w-lg mt-8 uppercase opacity-80">
                    İstanbul'un en seçkin gecesinde, Tüpraş Stadyumu'nda Scorpions 40. Yıl Turnesi ile tarihin en prestijli VIP deneyimine hazır olun.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-8 p-10 bg-zinc-950/50 border border-zinc-900/50 rounded-[3rem] group/card hover:border-rose-600/40 transition-all duration-700 shadow-2xl">
                  <div className="p-6 bg-rose-600/10 rounded-3xl border border-rose-600/20 group-hover/card:scale-110 transition-transform duration-700">
                    <Calendar className="w-12 h-12 text-rose-600" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-white text-4xl font-black italic tracking-tighter uppercase leading-none">24 HAZİRAN</span>
                    <span className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.6em]">ETKİNLİK TARİHİ</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 p-10 bg-zinc-950/50 border border-zinc-900/50 rounded-[3rem] group/card hover:border-rose-600/40 transition-all duration-700 shadow-2xl">
                  <div className="p-6 bg-rose-600/10 rounded-3xl border border-rose-600/20 group-hover/card:scale-110 transition-transform duration-700">
                    <MapPin className="w-12 h-12 text-rose-600" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-white text-4xl font-black italic tracking-tighter uppercase leading-none">TÜPRAŞ STAD</span>
                    <span className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.6em]">BEŞİKTAŞ, İST</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-10 pt-10 items-center">
                <button className="rose-button px-16 py-8 rounded-[2rem] text-lg font-black shadow-glow-rose group/btn flex items-center gap-4 border-none cursor-pointer">
                  DETAYLARI GÖR <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-16 h-16 rounded-full border-4 border-zinc-950 bg-rose-600/20 flex items-center justify-center text-[11px] font-black text-rose-600 shadow-2xl backdrop-blur-xl relative overflow-hidden group/vip cursor-pointer">
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/vip:opacity-100 transition-opacity" />
                         VIP
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white text-base font-black uppercase tracking-widest italic">+500 ELİT MİSAFİR</span>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                       <span className="text-[11px] text-rose-600 font-black uppercase tracking-[0.5em] leading-none">REZERVASYON AKTİF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="aspect-[5/6] bg-zinc-950 rounded-[5rem] overflow-hidden border border-zinc-900/50 relative shadow-3xl group-hover:border-rose-600/20 transition-all duration-1000">
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10" />
                
                {/* 🛡️ SCORPIONS MUSIC AMBIANCE */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="relative scale-125">
                      <div className="absolute inset-0 bg-rose-600/10 blur-[150px] rounded-full animate-pulse" />
                      <Music className="w-80 h-80 text-rose-600/10 relative z-10 opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" />
                   </div>
                </div>

                <div className="absolute inset-10 flex flex-col justify-end z-20 space-y-10 p-12">
                   <div className="space-y-4">
                      <div className="bg-rose-600 text-black px-10 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.6em] italic shadow-glow-rose inline-block">EXCLUSIVE ACCESS</div>
                      <h4 className="text-white text-6xl font-black italic tracking-tighter uppercase leading-[0.85]">
                        EN SEÇKİN REFAKAT <br/> DENEYİMİ İÇİN ŞİMDİ <br/> YERİNİZİ AYIRTIN.
                      </h4>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                      <div className="flex flex-col gap-2">
                         <ShieldCheck className="w-8 h-8 text-rose-600" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest italic leading-tight">Kimlik Onaylı Profil</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <Users className="w-8 h-8 text-rose-600" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest italic leading-tight">%100 Gerçek Model</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <Zap className="w-8 h-8 text-rose-600" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest italic leading-tight">Hızlı Randevu Sistemi</span>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* 🔱 FLOATING BADGE */}
              <div className="absolute -top-16 -right-16 w-64 h-64 glass-card border-rose-600/20 rounded-full flex flex-col items-center justify-center shadow-glow-rose rotate-12 group-hover:rotate-0 transition-transform duration-1000 z-30 pointer-events-none">
                <span className="text-rose-600 text-7xl font-black italic leading-none drop-shadow-glow">2026</span>
                <span className="text-white text-[12px] font-black uppercase tracking-[0.4em] mt-3">SCORPIONS TOUR</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
