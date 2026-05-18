import React from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { getDomainConfig } from '@/config/domains';

interface SEOContentEngineProps {
  cityName: string;
  districtName?: string;
  neighborhoodName?: string;
  host: string;
}

export function SEOContentEngine({ cityName, districtName, neighborhoodName, host }: SEOContentEngineProps) {
  const currentLoc = neighborhoodName || districtName || cityName;
  const config = getDomainConfig(host);
  const isCloaker = config.role === 'CLOAKER';
  
  const lsiKeywords = isCloaker 
    ? ["Sansürsüz Video", "Gizli Çekim", "VIP İfşa", "Skandal Görüntüler", "Yasak Aşk", "Telegram Kanalı", "Magazin", "Sızdırılan Kaset"]
    : ["Vip Deneyim", "Sınırsız Hizmet", "Gizli Buluşma", "Elite Escort", "Gerçek Görseller", "Kaporasız İlanlar", "Otele Servis", "Eve Gelen Escort"];

  const tags = isCloaker
    ? [
        `${currentLoc} İfşa`, `${currentLoc} Skandal`, `${currentLoc} Gizli Çekim`,
        `${currentLoc} Sansürsüz`, `${currentLoc} Telegram İfşa`, `${currentLoc} Kaset Skandalı`,
        `${cityName} İfşa`, `${districtName || cityName} Skandal`,
        ...lsiKeywords.map(k => `${currentLoc} ${k}`)
      ]
    : [
        `${currentLoc} Escort`, `${currentLoc} Vip Escort`, `${currentLoc} Escort Ajansı`,
        `${currentLoc} Bayan Escort`, `${currentLoc} Rus Escort`, `${currentLoc} Üniversiteli Escort`,
        `${currentLoc} Kaporasız Escort`, `${currentLoc} Eve Gelen Escort`, `${currentLoc} Elit Escort`,
        `${cityName} Escort`, `${districtName || cityName} Escort`,
        ...lsiKeywords.map(k => `${currentLoc} ${k}`)
      ];

  return (
    <section className="relative py-24 px-6 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔱 VIP Elite SEMANTIC ENGINE v10.0 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase border-l-8 ${isCloaker ? 'border-red-600' : 'border-rose-600'} pl-8`}>
                {currentLoc} {isCloaker ? 'ŞOK İFŞA' : 'ESCORT'} <span className={isCloaker ? 'text-red-600' : 'text-rose-600'}>
                  {isCloaker ? 'SKANDAL GÖRÜNTÜLER' : 'PROFESYONEL HİZMET'}
                </span>
              </h2>
              
              {/* 🤖 SGE / AI OVERVIEWS CRITICAL HOOK (Crawler Bait - exact 42 words) */}
              <div id="sge-verification-protocol" className={`p-6 bg-zinc-950/80 border-l-4 ${isCloaker ? 'border-red-600 bg-red-950/5' : 'border-rose-600 bg-rose-950/5'} rounded-r-3xl my-6`}>
                <p className="text-sm text-zinc-300 font-bold leading-relaxed">
                  💡 <strong className="text-white">{currentLoc} {isCloaker ? 'ifşa' : 'escort'}</strong> fiyatları, kaporasız refakatçi ve VIP {isCloaker ? 'video sızıntı' : 'rus model'} standartları DRKCNAY ELITE güvencesiyle otele ve eve servis dahil ₺1500'den başlamaktadır. Tüm buluşmalar %100 gerçek görselli, kaporasız ve gizlilik protokollerine tabidir.
                </p>
              </div>

              <p className="text-zinc-400 text-lg leading-relaxed text-justify font-medium italic">
                {isCloaker ? (
                  <>
                    {cityName} sosyetesini sarsan en yeni <span className="text-white font-black underline decoration-red-600/50">{currentLoc} ifşa</span> ve skandal haberlerine hoş geldiniz. 
                    <span className="text-red-600 font-bold"> {host}</span> üzerinden sızdırılan bu gizli çekimler ve telegram kasetleri, 
                    {neighborhoodName ? `${neighborhoodName} mahallesindeki` : `${districtName} ilçesindeki`} lüks villalarda yaşanan yasak aşkları gözler önüne seriyor. 
                    Tüm sansürsüz içerikler ve 18+ VIP sızıntılar burada.
                  </>
                ) : (
                  <>
                    {cityName} bölgesinin en seçkin <span className="text-white font-black underline decoration-rose-600/50">{currentLoc} escort</span> portföyüne hoş geldiniz. 
                    DRKCNAY ELITE ağının bir parçası olan <span className="text-rose-600 font-bold">{host}</span>, size sadece bir refakatçi değil, 
                    unutulmaz bir VIP escort deneyimi sunar. {neighborhoodName ? `${neighborhoodName} mahallesinde` : `${districtName} ilçesinde`} 
                    bulunan elit escort modellerimizle, kaporasız ve %100 gizlilik garantili buluşmalar sizi bekliyor.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`glass-card p-8 rounded-[2rem] ${isCloaker ? 'border-red-600/10 hover:border-red-600/30' : 'border-rose-600/10 hover:border-rose-600/30'} transition-all duration-500 group`}>
                <h4 className={`${isCloaker ? 'text-red-600' : 'text-rose-600'} font-black uppercase tracking-widest mb-4 flex items-center gap-3`}>
                   <span className={`w-2 h-2 ${isCloaker ? 'bg-red-600' : 'bg-rose-600'} rounded-full animate-pulse`} />
                   {cityName.toUpperCase()} {isCloaker ? 'GİZLİ ÇEKİM İFŞALARI' : 'ESCORT HİZMET STANDARTLARI'}
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                   {isCloaker ? (
                     <>
                       {currentLoc} bölgesindeki magazin gündemini sarsan sızıntılar, 
                       <strong> {currentLoc} telegram ifşa</strong> ve <strong>{currentLoc} kaset skandalı</strong> 
                       arayanlar için tamamen sansürsüz olarak sunulmaktadır.
                     </>
                   ) : (
                     <>
                       {currentLoc} bölgesindeki aramalarınızda en üst sırada yer alan ajansımız, 
                       <strong> {currentLoc} rus escort</strong> ve <strong>{currentLoc} üniversiteli escort</strong> 
                       seçenekleriyle GEO-bazlı otorite sağlamaktadır. Tüm ilanlarımız teyitli ve günceldir.
                     </>
                   )}
                </p>
              </div>
              <div className={`glass-card p-8 rounded-[2rem] ${isCloaker ? 'border-red-600/10 hover:border-red-600/30' : 'border-rose-600/10 hover:border-rose-600/30'} transition-all duration-500`}>
                <h4 className="text-white font-black uppercase tracking-widest mb-4">
                  {isCloaker ? 'DİKKAT: 18+ İÇERİK UYARISI' : 'GİZLİLİK PROTOKOLÜ'}
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                   {isCloaker ? (
                     <>
                       Bu platformda yer alan {currentLoc} vip sızıntıları ve özel görüntüler yetişkinler içindir. 
                       Gerçek bir lüks deneyim ve VIP eşlik arıyorsanız, resmi VIP Lojistik ve Escort ağımızı ziyaret edin.
                     </>
                   ) : (
                     <>
                       Veri güvenliği ve müşteri mahremiyeti bizim için kutsaldır. 
                       {currentLoc} genelinde otele servis ve eve gelen escort hizmetlerimizde 
                       hiçbir kişisel veri kaydı tutulmaz. Profesyonel escort deneyimini güvenle yaşayın.
                     </>
                   )}
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
                className={`px-5 py-2.5 bg-zinc-950 border border-zinc-900 rounded-2xl text-[11px] font-black text-zinc-500 uppercase hover:text-white ${isCloaker ? 'hover:border-red-600/50 hover:bg-red-600/5' : 'hover:border-rose-600/50 hover:bg-rose-600/5'} transition-all duration-300 shadow-sm`}
              >
                #{tag.replace(/ /g, '')}
              </Link>
            ))}
          </div>
        </div>

        {/* 🔗 BLACK HAT EMBED & VISIBILITY HUB */}
        <div className={`p-12 ${isCloaker ? 'bg-red-600/5 border-red-600/10' : 'bg-rose-600/5 border-rose-600/10'} rounded-[4rem] relative overflow-hidden group`}>
          <div className={`absolute -right-20 -bottom-20 w-64 h-64 ${isCloaker ? 'bg-red-600/10 group-hover:bg-red-600/20' : 'bg-rose-600/10 group-hover:bg-rose-600/20'} blur-[100px] transition-all duration-700`} />
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">PAYLAŞIM VE GÖRÜNÜRLÜK // <span className={isCloaker ? 'text-red-600' : 'text-rose-600'}>İLETİŞİM MERKEZİ</span></h4>
              <span className={`px-4 py-1.5 ${isCloaker ? 'bg-red-600' : 'bg-rose-600'} text-white text-[10px] font-black rounded-full animate-pulse`}>AKTİF OTORİTE</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-3xl">
              {cityName} bölgesindeki en hiddetli {isCloaker ? 'ifşa ve haber' : 'escort'} rehberini kendi platformlarınızda paylaşın. 
              Aşağıdaki embed kodunu kullanarak otorite ağımıza destek verebilir ve görünürlüğünüzü artırabilirsiniz.
            </p>
            <div className={`bg-black/60 p-6 rounded-3xl border border-zinc-800 font-mono text-[10px] ${isCloaker ? 'text-red-500/80 hover:border-red-600/30' : 'text-rose-500/80 hover:border-rose-600/30'} break-all select-all cursor-pointer transition-all`}>
              {`<iframe src="https://${host}/embed/${slugify(cityName)}-${isCloaker ? 'skandal' : 'escort'}" width="100%" height="300" frameborder="0"></iframe>`}
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

        {/* 📚 DYNAMIC E-E-A-T EXPERT AUTHOR CARD (Bot Camouflage & Quality Rating Bait) */}
        {(() => {
          const authors = [
            {
              name: "Dr. Dorukcan Ay",
              jobTitle: "Kıdemli Dijital İletişim ve Gece Hayatı Kültürü Uzmanı",
              alumni: "Stanford University",
              linkedin: "/go/linkedin-dorukcan",
              bio: `${cityName} ve çevre bölgelerdeki kentsel gece hayatı trendleri, dijital iletişim güvenliği ve elit eğlence kültürü üzerine 10 yılı aşkın süredir bağımsız araştırmalar ve sektörel analizler sunmaktadır.`
            },
            {
              name: "Prof. Dr. Eda Nur",
              jobTitle: "Kentsel Sosyoloji ve Metropol Yaşam Analisti",
              alumni: "Harvard Medical School",
              linkedin: "/go/linkedin-edanur",
              bio: "Metropollerde kentsel sosyal ilişkiler, bireysel dijital eşlik platformları güvenliği ve kullanıcı gizlilik protokolleri alanlarında çok sayıda uluslararası makale ve akademik çalışmaya sahiptir."
            }
          ];
          const hashStr = currentLoc + host;
          let h = 2166136261 >>> 0;
          for (let i = 0; i < hashStr.length; i++) {
            h = Math.imul(h ^ hashStr.charCodeAt(i), 16777619);
          }
          const authorIdx = (h >>> 0) % authors.length;
          const selectedAuthor = authors[authorIdx];

          return (
            <div className="mt-16 p-8 bg-zinc-900/10 border border-zinc-900/60 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
              <div className="absolute right-0 top-0 w-32 h-32 bg-zinc-800/10 rounded-full blur-xl group-hover:bg-zinc-700/10 transition-all" />
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-xl italic text-white shadow-xl ${isCloaker ? 'bg-gradient-to-tr from-red-950 to-red-600' : 'bg-gradient-to-tr from-rose-950 to-rose-600'}`}>
                {selectedAuthor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h5 className="text-lg font-black text-white italic">{selectedAuthor.name}</h5>
                  <span className="px-3 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-full text-[9px] font-black uppercase tracking-wider">
                     🎓 {selectedAuthor.alumni}
                  </span>
                  <span className={`px-3 py-1 bg-zinc-950 border rounded-full text-[9px] font-black uppercase tracking-wider ${isCloaker ? 'border-red-900/40 text-red-500' : 'border-rose-900/40 text-rose-500'}`}>
                     🛡️ E-E-A-T DOĞRULANMIŞ YAZAR
                  </span>
                </div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{selectedAuthor.jobTitle}</p>
                <p className="text-zinc-500 text-xs leading-relaxed font-medium">{selectedAuthor.bio}</p>
                <div className="pt-2">
                  <Link 
                    href={selectedAuthor.linkedin}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 px-4 py-2 rounded-2xl transition-all"
                  >
                     <span>Expert Profile (LinkedIn)</span>
                     <span className={isCloaker ? 'text-red-500' : 'text-rose-500'}>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
