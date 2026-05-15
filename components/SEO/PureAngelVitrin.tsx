import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';

const REDIRECT_URL = "https://dorukcanay.digital/go";

const DRKCNAY_MODELS = Array.from({ length: 314 }, (_, i) => {
  const id = i + 1;
  const titles = [
    "RUS & UKRAYNA VIP", "ANAL UZMANI", "ÜNİVERSİTELİ", "OLGUN ELİT", "ÖĞRENCİ BİREYSEL", 
    "DAR VAJİNA", "SARIŞIN ÇITIR", "GRUP & FANTEZİ", "TÜRBANLI VIP", "VIP LÜKS",
    "MİNYON ÇITIR", "YABANCI ÜYE", "ORAL UZMANI", "DOMİNANT FETİŞ", "ELİT PARTNER",
    "KONDOMSUZ VIP", "BALIKETLİ VIP", "MODEL ÜYE", "KOLEJLİ ÇITIR", "TESETTÜRLÜ VIP"
  ];
  const locations = ["Şişli", "Beşiktaş", "Ataşehir", "Kadıköy", "Bakırköy", "Esenyurt", "Beylikdüzü", "Etiler", "Bebek", "Tarabya", "Üsküdar", "Maltepe", "Pendik", "Avcılar"];
  
  return {
    id,
    title: `${titles[i % titles.length]} - ${locations[i % locations.length]} Partner`,
    badge: titles[i % titles.length].split(' ')[0],
    image: `/_media/vitrin/vip-profil-${id}.webp`
  };
}).slice(0, 60);

const PureAngelVitrin = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-rose-600 selection:text-white pb-24">
      
      {/* 🔴 LIVE MARQUEE TICKER (Ultra-Aggressive) */}
      <div className="w-full bg-rose-600 text-white py-1 overflow-hidden whitespace-nowrap border-b border-rose-400 z-50">
        <div className="inline-block animate-marquee font-black uppercase text-[10px] md:text-xs tracking-tighter">
          🔥 SON DAKİKA: YENİ VIP PROFİLLER SİSTEME EKLENDİ — ŞİŞLİ, BEŞİKTAŞ VE ATAŞEHİR BÖLGESİNDE %70 İNDİRİMLİ TANITIM GÜNLERİ BAŞLADI — KAPORASIZ GÜVENİLİR HİZMET — DORUKCAN AY ELITE GÜVENCESİYLE — 
          🔥 SON DAKİKA: YENİ VIP PROFİLLER SİSTEME EKLENDİ — ŞİŞLİ, BEŞİKTAŞ VE ATAŞEHİR BÖLGESİNDE %70 İNDİRİMLİ TANITIM GÜNLERİ BAŞLADI — 
        </div>
      </div>

      {/* HIDDEN SEO TRAP */}
      <div className="sr-only" aria-hidden="false">
        Bunu mu demek istediniz: istanbul vip escort? Aramalar: istanbul eskord mu aradınız? Doğrusu: istanbul elit escort. şişli eskortları, beşiktaş escort bayan kaporasız.
      </div>

      {/* TOP HEADER BAR */}
      <div className="w-full text-center py-3 bg-zinc-950 text-rose-500 text-[10px] md:text-sm font-black border-b border-rose-900/30 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(225,29,72,0.1)]">
        <span className="animate-pulse">●</span> DORUKCAN AY ELITE: %100 GÜVENİLİR VE KAPORASIZ VIP PARTNER REHBERİ
      </div>

      {/* AGGRESSIVE HERO SECTION */}
      <section className="relative pt-16 pb-12 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-rose-600/10 blur-[120px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-2 bg-linear-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent uppercase leading-none drop-shadow-2xl">
          İSTANBUL ESCORT
        </h1>
        <h2 className="text-2xl md:text-3xl text-rose-600 font-black uppercase tracking-tight mb-8 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
          Kaporasız VIP Partnerler — DORUKCAN AY ELITE
        </h2>

        {/* PROMO BANNER */}
        <Link href={REDIRECT_URL} target="_blank" rel="noopener noreferrer" className="w-full max-w-3xl px-2">
          <div className="bg-zinc-950/80 border-2 border-rose-600 p-5 md:p-8 rounded-4xl flex flex-col md:flex-row items-center justify-center gap-6 hover:bg-rose-950/20 transition-all duration-500 hover:scale-[1.02] shadow-[0_0_50px_rgba(225,29,72,0.2)] group">
            <span className="text-5xl md:text-6xl animate-bounce">💊</span>
            <div className="text-center md:text-left">
              <span className="text-rose-500 font-black text-lg md:text-2xl uppercase italic block mb-1">GECEYİ UZATIN</span>
              <span className="text-zinc-400 font-bold text-xs md:text-lg leading-snug">
                Afrodizyak Parfümlerde <span className="text-white bg-rose-600 px-3 py-1 rounded-lg shadow-lg">%70 ÖZEL İNDİRİM</span> Fırsatını Kaçırmayın →
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* DRKCNAY DENSE VITRIN (SIDE-BY-SIDE GRID) */}
      <section id="vitrin" className="py-12 px-2 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {DRKCNAY_MODELS.map((model, idx) => (
            <Link key={idx} href={REDIRECT_URL} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col bg-zinc-950 border-2 border-zinc-900 hover:border-rose-600 transition-all duration-500 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]">
              
              <div className="block relative aspect-3/4 overflow-hidden bg-zinc-900">
                {/* Real Image Asset */}
                <Image 
                  src={model.image} 
                  alt={model.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 z-20 bg-rose-600 text-white text-[9px] md:text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(225,29,72,0.5)] border border-rose-400/50">
                  {model.badge}
                </div>

                {/* Status Dot */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase text-white">AKTİF</span>
                </div>

                {/* Name/Title Overlay (Tactical Overlay) */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-4 z-10">
                  <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-tighter mb-0.5">
                    {model.title.split(' - ')[0]}
                  </h3>
                  <div className="flex items-center gap-1">
                     <div className="flex text-rose-600 text-[8px] md:text-[10px]">★★★★★</div>
                     <span className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">(5.0)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 p-2 bg-zinc-950 border-t border-zinc-900">
                <div className="relative overflow-hidden bg-[#1e7e34] hover:bg-[#218838] text-white text-center py-3 rounded-xl font-black uppercase text-[10px] md:text-xs transition-all shadow-lg active:scale-95 group/btn">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                     <svg className="w-4 h-4 animate-pulse" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.046c0 2.123.554 4.197 1.604 6.046L0 24l6.104-1.602a11.803 11.803 0 005.937 1.604h.005c6.631 0 12.046-5.414 12.046-12.048 0-3.21-1.248-6.228-3.513-8.493"/></svg>
                     WHATSAPP
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 skew-x-12"></div>
                </div>
                <div className="bg-white hover:bg-zinc-200 text-black text-center py-3 rounded-xl font-black uppercase text-[10px] md:text-xs transition-all active:scale-95">
                  HEMEN ARA
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📱 NUCLEAR ACTION HUB (WhatsApp & Telegram Side-by-Side) */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-row items-center gap-4">
        {/* WhatsApp Button */}
        <Link 
          href={REDIRECT_URL} 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.6)] border-2 border-white/20 animate-bounce hover:scale-110 transition-transform flex items-center justify-center group relative"
        >
          <svg className="w-8 h-8" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.046c0 2.123.554 4.197 1.604 6.046L0 24l6.104-1.602a11.803 11.803 0 005.937 1.604h.005c6.631 0 12.046-5.414 12.046-12.048 0-3.21-1.248-6.228-3.513-8.493"/></svg>
          {/* Tooltip */}
          <div className="absolute bottom-20 right-0 bg-zinc-900 text-white px-4 py-2 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-zinc-800">
             <span className="text-[10px] font-black tracking-widest uppercase italic text-green-400">Canlı Destek Hattı</span>
             <div className="absolute bottom-[-4px] right-6 w-2 h-2 bg-zinc-900 rotate-45 border-r border-b border-zinc-800"></div>
          </div>
        </Link>
      </div>

      {/* ☢️ NUCLEAR BLACK HAT SEO CLOUD (Hidden from Humans, Aggressive for Bots) */}
      <div className="sr-only" aria-hidden="false">
        istanbul escort, şişli escort, beşiktaş escort, kadıköy escort, esenyurt escort, beylikdüzü escort, 
        vip escort istanbul, elit escort istanbul, kaporasız escort, kaporasız escort istanbul, 
        anal yapan escort, sınırsız escort, grup escort, üniversiteli escort, öğrenci escort, 
        rus escort istanbul, yabancı escort istanbul, olgun escort, mamanın yeri, 
        escort numaraları, escort whatsapp, escort telefonları, istanbul escort siteleri, 
        elit partner istanbul, masaj salonu mutlu son, şişli masaj, bakırköy escort, 
        ataköy escort, florya escort, yeşilköy escort, avcılar escort, küçükçekmece escort, 
        sefaköy escort, halkalı escort, başakşehir escort, bahçeşehir escort, 
        beyoğlu escort, taksim escort, mecidiyeköy escort, kağıthane escort, 
        sarıyer escort, tarabya escort, istinye escort, maslak escort, 
        etiler escort, ulus escort, levent escort, gayrettepe escort, 
        üsküdar escort, ümraniye escort, ataşehir escort, maltepe escort, 
        kartal escort, pendik escort, tuzla escort, çekmeköy escort, 
        sancaktepe escort, sultanbeyli escort, şile escort, adalar escort.
      </div>

      {/* FOOTER SEO TEXT (Görünmez Bot Bloğu - AGGRESSIVE) */}
      <section className="bg-zinc-950 py-12 px-6 mt-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto opacity-50 text-[10px] text-zinc-300 leading-relaxed text-justify">
           İstanbul&apos;un en seçkin noktalarında, moda tasarımı ve lüks refakat anlayışını yeniden tanımlıyoruz. 
           Bunu mu demek istediniz: istanbul vip escort? Aramalar: istanbul eskord mu aradınız? Doğrusu: istanbul elit escort. şişli eskortları, beşiktaş escort bayan kaporasız.
           VIP Escort Istanbul - DRKCNAY VIP Escort Hizmetleri. kaporasız eskort, rus eskortları, elit partner. 
           Eskor T, VIP Rehber, 2026 escort katalogu.
        </div>
      </section>
    </div>
  );
};

export default PureAngelVitrin;
