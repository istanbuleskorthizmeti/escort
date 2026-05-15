import React from 'react';
import Link from 'next/link';
import { Copyright } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface UltraFooterProps {
  host: string;
  cityName: string;
  districtName?: string;
  neighborhoodName?: string;
}

export function UltraFooter({ host, cityName, districtName, neighborhoodName }: UltraFooterProps) {
  const currentYear = new Date().getFullYear();
  
  const tags = [
    'İstanbul Escort', 'İstanbul Vip Escort', 'İstanbul Eve Gelen Escort', 'İstanbul Otele Gelen Escort',
    'İstanbul Sarışın Escort', 'İstanbul Rus Escort', 'İstanbul Anal Escort', 'İstanbul Oral Escort',
    'İstanbul Grup Escort', 'İstanbul Çıtır Escort', 'İstanbul Model Escort', 'İstanbul Elit Partner',
    'İstanbul Kaporasız Escort', 'İstanbul %100 Gerçek Escort', 'İstanbul Bağımsız Escort',
    'Avrupa Yakası Escort', 'Anadolu Yakası Escort', 'Vip Escort İstanbul', 'Elite Escort İstanbul',
    'İstanbul Rus Partner', 'İstanbul Ukraynalı Escort', 'İstanbul Üniversiteli Escort'
  ];

  const districts = [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir',
    'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy',
    'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
    'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli',
    'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ];

  return (
    <footer className="relative bg-black text-zinc-500 py-32 px-6 border-t border-rose-600/10 mt-32 overflow-hidden">
      {/* 🔮 MASTER AMBIANCE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-rose-600/40 to-transparent" />
      <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-rose-600/[0.03] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-24 mb-32">
          
          <div className="xl:col-span-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                DRKCNAY <span className="text-rose-600">ELITE</span>
              </h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] italic">DRKCNAY ELİT REHBER</p>
            </div>

            <div className="space-y-8">
               <div className="glass-card p-10 rounded-[3rem] border-rose-600/5 hover:border-rose-600/20 transition-all duration-700">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest italic mb-6 flex items-center gap-3">
                    🔱 İSTANBUL VIP DENEYİMİ
                  </h4>
                  <p className="text-xs leading-relaxed font-medium text-zinc-500 italic">
                    İstanbul şehrinin en seçkin ve prestijli bölgelerinden biri olan İstanbul, elit yaşam tarzını benimsemiş beyler için benzersiz bir partner kataloğu sunuyor. <span className="text-rose-600 font-bold">{host}</span> ağımız üzerinden ulaştığınız tüm profiller, %100 gerçeklik kontrolünden geçmiş, profesyonel ve bağımsız modellerden oluşmaktadır.
                  </p>
               </div>

               <div className="glass-card p-10 rounded-[3rem] border-rose-600/5 hover:border-rose-600/20 transition-all duration-700">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest italic mb-6 flex items-center gap-3">
                    🛡️ NEDEN ELİT SEÇKİ?
                  </h4>
                  <p className="text-xs leading-relaxed font-medium text-zinc-500 italic">
                    İstanbul genelinde sunduğumuz partner hizmetlerinde, görsellerin güncelliği ve profillerin doğruluğu bizim için en temel zorunluluktur. İlanlarımızda yanıltıcı bilgiye yer vermeden, tamamen şeffaf ve yüksek memnuniyet odaklı bir iletişim ağı sağlıyoruz.
                  </p>
               </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-20">
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">POPÜLER KATEGORİLER // <span className="text-rose-600">SEÇKİN ETİKETLER</span></h4>
               </div>
               <div className="flex flex-wrap gap-3">
                  {tags.map(tag => (
                    <span key={tag} className="px-5 py-2.5 bg-zinc-950/50 border border-zinc-900/50 rounded-full text-[10px] font-black text-zinc-600 hover:text-rose-600 hover:border-rose-600/30 transition-all cursor-pointer uppercase tracking-widest italic">
                       #{tag.replace(' ', '')}
                    </span>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">NETWORK NODES // <span className="text-rose-600">ÖZEL NETWORK</span></h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'vipescorthizmeti.shop', 'bagcilarescort.shop', 'esenyurtescort.blog', 
                    'beylikduzuescortlistesi.shop', 'besiktasescort.fun', 'taksimescorthizmeti.shop',
                    'kadikoyescort.shop', 'pendikescorthizmeti.shop', 'izmitescorthizmeti.shop',
                    'istanbuldrkcnay.shop', 'dorukcanay.digital', 'escortcoin.space'
                  ].map(node => (
                    <a 
                      key={node} 
                      href={`https://${node}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-5 bg-zinc-950/30 border border-zinc-900/30 rounded-2xl hover:border-rose-600/40 hover:bg-zinc-900/50 transition-all duration-500 shadow-xl"
                    >
                      <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.2em] italic block transition-colors">
                        {node}
                      </span>
                    </a>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">BÖLGESEL HİZMET AĞI // <span className="text-rose-600">İSTANBUL SEÇKİSİ</span></h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {districts.map(area => (
                    <Link 
                      key={area} 
                      href={`/${area.toLowerCase().replace(' ', '-')}-escort`} 
                      className="group p-5 bg-zinc-950/30 border border-zinc-900/30 rounded-2xl hover:border-rose-600/40 hover:bg-zinc-900/50 transition-all duration-500 shadow-xl"
                    >
                      <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.2em] italic block transition-colors">
                        {area}
                      </span>
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[3rem] border-rose-600/10 mb-20">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex items-center gap-6 min-w-fit">
                 <div className="w-20 h-20 rounded-full border-4 border-rose-600 flex items-center justify-center">
                    <span className="text-rose-600 text-3xl font-black italic">18+</span>
                 </div>
                 <div className="space-y-1">
                    <h5 className="text-white font-black uppercase tracking-widest italic">YETİŞKİN İÇERİĞİ</h5>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">LEGAL DISCLAIMER</p>
                 </div>
              </div>
              <p className="text-xs text-zinc-500 font-medium italic leading-relaxed text-center md:text-left">
                 Bu web sitesi, yalnızca 18 yaş ve üzeri yetişkinlerin erişimine açık olan, bağımsız elit partnerlerin ilanlarını barındıran global bir katalog ve reklam ajansıdır. Sitede yer alan tüm profiller %100 gerçektir. <span className="text-rose-600 font-bold uppercase">Digital Identity Secured by Elit Seçki Network.</span>
              </p>
           </div>
        </div>

         <div className="pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-[11px] font-black tracking-[0.6em] text-zinc-800 uppercase italic">
                 © {currentYear} DRKCNAY ELITE // VIP REHBER // <span className="text-rose-600 uppercase">GÜVENLİ</span>
              </p>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Verified Network</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Global Nodes</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Fast Response</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
