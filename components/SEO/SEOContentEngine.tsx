import React from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

interface SEOContentEngineProps {
  cityName: string;
  districtName?: string;
  neighborhoodName?: string;
  host: string;
}

export function SEOContentEngine({ cityName, districtName, neighborhoodName, host }: SEOContentEngineProps) {
  const currentLoc = neighborhoodName || districtName || cityName;
  
  const lsiKeywords = [
    "Vip Deneyim", "Sınırsız Hizmet", "Gizli Buluşma", "Elite Escort", 
    "Gerçek Görseller", "Kaporasız İlanlar", "Otele Servis", "Eve Gelen Escort",
    "Gecelik Escort", "Saatlik Buluşma", "Üniversiteli Çıtır", "Olgun Lady"
  ];

  const tags = [
    `${currentLoc} Escort`, `${currentLoc} Vip Escort`, `${currentLoc} Escort Ajansı`,
    `${currentLoc} Bayan Escort`, `${currentLoc} Rus Escort`, `${currentLoc} Üniversiteli Escort`,
    `${currentLoc} Kaporasız Escort`, `${currentLoc} En İyi Escort`, `${currentLoc} Eve Gelen Escort`,
    `${currentLoc} Otele Gelen Escort`, `${currentLoc} %100 Gerçek Escort`, `${currentLoc} Elit Escort`,
    `${cityName} Escort`, `${districtName || cityName} Escort`,
    ...lsiKeywords.map(k => `${currentLoc} ${k}`)
  ];

  return (
    <section className="relative py-24 px-6 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔱 GOD MODE SEMANTIC ENGINE v10.0 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase border-l-8 border-rose-600 pl-8">
                {currentLoc} ESCORT <span className="text-rose-600">PROFESYONEL HİZMET</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed text-justify font-medium italic">
                {cityName} bölgesinin en seçkin <span className="text-white font-black underline decoration-rose-600/50">{currentLoc} escort</span> portföyüne hoş geldiniz. 
                DRKCNAY ELITE ağının bir parçası olan <span className="text-rose-600 font-bold">{host}</span>, size sadece bir refakatçi değil, 
                unutulmaz bir VIP escort deneyimi sunar. {neighborhoodName ? `${neighborhoodName} mahallesinde` : `${districtName} ilçesinde`} 
                bulunan elit escort modellerimizle, kaporasız ve %100 gizlilik garantili buluşmalar sizi bekliyor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-[2rem] border-rose-600/10 hover:border-rose-600/30 transition-all duration-500 group">
                <h4 className="text-rose-600 font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                   <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                   {cityName.toUpperCase()} ESCORT HİZMET STANDARTLARI
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                   {currentLoc} bölgesindeki aramalarınızda en üst sırada yer alan ajansımız, 
                   <strong>{currentLoc} rus escort</strong> ve <strong>{currentLoc} üniversiteli escort</strong> 
                   seçenekleriyle GEO-bazlı otorite sağlamaktadır. Tüm ilanlarımız teyitli ve günceldir.
                </p>
              </div>
              <div className="glass-card p-8 rounded-[2rem] border-rose-600/10 hover:border-rose-600/30 transition-all duration-500">
                <h4 className="text-white font-black uppercase tracking-widest mb-4">GİZLİLİK PROTOKOLÜ</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                   Veri güvenliği ve müşteri mahremiyeti bizim için kutsaldır. 
                   {currentLoc} genelinde otele servis ve eve gelen escort hizmetlerimizde 
                   hiçbir kişisel veri kaydı tutulmaz. Profesyonel escort deneyimini güvenle yaşayın.
                </p>
              </div>
            </div>
          </div>

          {/* 🕷️ INTERNAL LINKING WEB (Backlinks) */}
          <div className="space-y-8">
             <div className="p-8 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-[3rem]">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 border-b border-zinc-800 pb-4">
                   YAKIN BÖLGELER // {cityName.toUpperCase()}
                </h3>
                <div className="flex flex-col gap-3">
                   {["Şişli", "Beşiktaş", "Kadıköy", "Ataşehir", "Bakırköy"].map((loc) => (
                      <Link 
                        key={loc} 
                        href={`/istanbul/${loc.toLowerCase().replace('ş','s').replace('ç','c').replace('ı','i')}`}
                        className="text-sm font-bold text-zinc-400 hover:text-rose-600 transition-colors flex items-center justify-between group"
                      >
                         <span>{loc} Escort</span>
                         <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                   ))}
                </div>
             </div>
             
          </div>
        </div>

        {/* 🏷️ AGGRESSIVE TAG POOL */}
        <div className="flex flex-col gap-10 p-12 bg-black/40 backdrop-blur-3xl border border-zinc-900 rounded-[4rem] shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h4 className="text-lg font-black italic text-white uppercase tracking-tighter">Niş Etiket Havuzu</h4>
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Elit Rehber Listeleme v24.0</p>
            </div>
            <div className="h-px hidden md:block flex-1 mx-12 bg-zinc-900/50" />
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-rose-600/10 border border-rose-600/20 rounded-full text-[9px] font-black text-rose-600">ESCORT LSI ACTIVE</span>
               <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black text-zinc-500">GEO MAP SYNC</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Link 
                key={idx} 
                href={`/${slugify(cityName)}/${slugify(tag)}`}
                className="px-5 py-2.5 bg-zinc-950 border border-zinc-900 rounded-2xl text-[11px] font-black text-zinc-500 uppercase hover:text-white hover:border-rose-600/50 hover:bg-rose-600/5 transition-all duration-300 shadow-sm"
              >
                #{tag.replace(/ /g, '')}
              </Link>
            ))}
          </div>
        </div>

        {/* 🔗 BLACK HAT EMBED & VISIBILITY HUB */}
        <div className="p-12 bg-rose-600/5 border border-rose-600/10 rounded-[4rem] relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-rose-600/10 blur-[100px] group-hover:bg-rose-600/20 transition-all duration-700" />
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">PAYLAŞIM VE GÖRÜNÜRLÜK // <span className="text-rose-600">İLETİŞİM MERKEZİ</span></h4>
              <span className="px-4 py-1.5 bg-rose-600 text-white text-[10px] font-black rounded-full animate-pulse">AKTİF OTORİTE</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-3xl">
              {cityName} bölgesindeki en hiddetli escort rehberini kendi platformlarınızda paylaşın. 
              Aşağıdaki embed kodunu kullanarak otorite ağımıza destek verebilir ve görünürlüğünüzü artırabilirsiniz.
            </p>
            <div className="bg-black/60 p-6 rounded-3xl border border-zinc-800 font-mono text-[10px] text-rose-500/80 break-all select-all cursor-pointer hover:border-rose-600/30 transition-all">
              {`<iframe src="https://${host}/embed/${slugify(cityName)}-escort" width="100%" height="300" frameborder="0"></iframe>`}
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Gizlilik Garantisi</p>
                <div className="text-white font-black text-xs italic">AKTİF</div>
              </div>
              <div className="flex-1 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Doğrulanmış Vitrin</p>
                <div className="text-white font-black text-xs italic">AKTİF</div>
              </div>
              <div className="flex-1 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Kesintisiz Destek</p>
                <div className="text-rose-600 font-black text-xs italic">7/24</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
