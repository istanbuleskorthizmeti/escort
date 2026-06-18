import React from 'react';
import Link from 'next/link';
import { LocalAuthority } from './LocalAuthority';

interface UltraFooterProps {
  host: string;
  cityName: string;
  districtName?: string;
  neighborhoodName?: string;
}

export function UltraFooter({ host, cityName: _cityName, districtName: _districtName, neighborhoodName: _neighborhoodName }: UltraFooterProps) {
  const currentYear = new Date().getFullYear();
  
  const tags = [
    'İstanbul Escort', 'İstanbul Vip Escort', 'İstanbul Eve Gelen Escort', 'İstanbul Otele Gelen Escort',
    'İstanbul Sarışın Escort', 'İstanbul Rus Escort', 'İstanbul Anal Escort', 'İstanbul Oral Escort',
    'İstanbul Grup Escort', 'İstanbul Elite Escort', 'İstanbul Model Escort', 'İstanbul Elit Partner',
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

  const isFlagship = host.includes('dorukcanay.digital');

  return (
    <footer className="relative bg-black text-zinc-500 py-32 px-6 border-t border-(--primary-color)/10 mt-32 overflow-hidden">
      {/* 🔮 MASTER AMBIANCE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-(--primary-color)/40 to-transparent" />
      <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-(--primary-color)/[0.03] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-24 mb-32">
          
          <div className="xl:col-span-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                DRKCNAY <span className="text-(--primary-color)">VIP</span>
              </h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] italic">DRKCNAY VIP ESCORT AJANSI</p>
            </div>

            <div className="space-y-8">
               {host.includes('istanbulescort.blog') && (
                 <div className="glass-card p-10 rounded-[3rem] border-rose-600/30 bg-rose-950/10 hover:border-rose-600/50 transition-all duration-700 animate-pulse-glow">
                   <h4 className="text-white text-sm font-black uppercase tracking-widest italic mb-6 flex items-center gap-3">
                     🟢 RESMİ VIP ORTAĞIMIZ // DRKCNAY VIP ESCORT AJANSI
                   </h4>
                   <p className="text-xs leading-relaxed font-semibold text-zinc-300 italic mb-6">
                     Türkiye&apos;nin en kaliteli escort rehberi olan 
                     <a href="https://dorukcanay.digital" className="text-rose-500 font-bold hover:underline mx-1 text-sm tracking-wider uppercase" target="_blank" rel="noopener noreferrer">dorukcanay.digital</a> 
                     üzerinden %100 doğrulanmış, kaporasız ve VIP escort bayan profillerini inceleyebilirsiniz. En seçkin bağımsız modeller burada yer almaktadır.
                   </p>
                   <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest">
                     <a href="https://dorukcanay.digital/istanbul/sisli-escort" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-colors">#ŞişliEscort</a>
                     <a href="https://dorukcanay.digital/istanbul/besiktas-escort" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-colors">#BeşiktaşEscort</a>
                     <a href="https://dorukcanay.digital/istanbul/kadikoy-escort" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-colors">#KadıköyEscort</a>
                     <a href="https://dorukcanay.digital/istanbul/beylikduzu-escort" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-colors">#BeylikdüzüEscort</a>
                   </div>
                 </div>
               )}

               <div className="glass-card p-10 rounded-[3rem] border-(--primary-color)/5 hover:border-(--primary-color)/20 transition-all duration-700">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest italic mb-6 flex items-center gap-3">
                    🔱 {isFlagship ? 'PRESTİJ VE LÜKS COMPANION' : 'İSTANBUL VIP DENEYİMİ'}
                  </h4>
                  <p className="text-xs leading-relaxed font-medium text-zinc-500 italic">
                    {isFlagship ? (
                      <>
                        dorukcanay.digital, İstanbul&apos;un en seçkin beyleri için tasarlanmış, lüks ve prestijli yaşam tarzını tamamlayan özel bir partner rehberidir. Ağımızda listelenen tüm profiller, %100 gerçek resimleriyle kaporasız ve en üst düzey gizlilik standartlarına uygun olarak hizmet vermektedir.
                      </>
                    ) : (
                      <>
                        İstanbul şehrinin en seçkin ve prestijli bölgelerinden biri olan İstanbul, elit yaşam tarzını benimsemiş beyler için benzersiz bir partner kataloğu sunuyor. <span className="text-(--primary-color) font-bold">{host}</span> ağımız üzerinden ulaştığınız tüm profiller, %100 gerçeklik kontrolünden geçmiş, profesyonel ve bağımsız modellerden oluşmaktadır.
                      </>
                    )}
                  </p>
               </div>
 
               <div className="glass-card p-10 rounded-[3rem] border-(--primary-color)/5 hover:border-(--primary-color)/20 transition-all duration-700">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest italic mb-6 flex items-center gap-3">
                    🛡️ {isFlagship ? 'DRKCNAY VIP ESCORT AJANSI STANDARTLARI' : 'NEDEN VIP AJANS?'}
                  </h4>
                  <p className="text-xs leading-relaxed font-medium text-zinc-500 italic">
                    {isFlagship ? (
                      <>
                        Bağımsız model partnerlerimizle gerçekleştireceğiniz randevularda ön ödeme veya kapora şartı bulunmamaktadır. Her profili özenle doğrulayarak, güvenli, şeffaf ve kusursuz bir eşlik deneyimi sunmayı taahhüt ediyoruz.
                      </>
                    ) : (
                      <>
                        İstanbul genelinde sunduğumuz partner hizmetlerinde, görsellerin güncelliği ve profillerin doğruluğu bizim için en temel zorunluluktur. İlanlarımızda yanıltıcı bilgiye yer vermeden, tamamen şeffaf ve yüksek memnuniyet odaklı bir iletişim ağı sağlıyoruz.
                      </>
                    )}
                  </p>
               </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-20">
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">POPÜLER <span className="text-(--primary-color)">KATEGORİLER</span></h4>
               </div>
               <div className="flex flex-wrap gap-3">
                  {tags.map(tag => (
                    <Link 
                      key={tag} 
                      href="/"
                      className="px-5 py-2.5 bg-zinc-950/50 border border-zinc-900/50 rounded-full text-[10px] font-black text-zinc-600 hover:text-(--primary-color) hover:border-(--primary-color)/30 transition-all cursor-pointer uppercase tracking-widest italic"
                      style={{ textDecoration: 'none' }}
                    >
                       #{tag.replace(' ', '')}
                    </Link>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">ÖNERİLEN <span className="text-(--primary-color)">PARTNERLERİMİZ</span></h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
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
                      className="group p-5 bg-zinc-950/30 border border-zinc-900/30 rounded-2xl hover:border-(--primary-color)/40 hover:bg-zinc-900/50 transition-all duration-500 shadow-xl"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.2em] italic block transition-colors" style={{ color: '#52525b' }}>
                        {node}
                      </span>
                    </a>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <h4 className="text-white text-xl font-black uppercase tracking-widest italic">HİZMET VERİLEN <span className="text-(--primary-color)">BÖLGELER</span></h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {districts.map(area => (
                    <Link 
                      key={area} 
                      href={`/${area.toLowerCase().replace(' ', '-')}-escort`} 
                      className="group p-5 bg-zinc-950/30 border border-zinc-900/30 rounded-2xl hover:border-(--primary-color)/40 hover:bg-zinc-900/50 transition-all duration-500 shadow-xl"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.2em] italic block transition-colors" style={{ color: '#52525b' }}>
                        {area}
                      </span>
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[3rem] border-(--primary-color)/10 mb-20">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex items-center gap-6 min-w-fit">
                 <div className="w-20 h-20 rounded-full border-4 border-(--primary-color) flex items-center justify-center">
                    <span className="text-(--primary-color) text-3xl font-black italic">18+</span>
                 </div>
                 <div className="space-y-1">
                    <h5 className="text-white font-black uppercase tracking-widest italic">YETİŞKİN İÇERİĞİ</h5>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">LEGAL DISCLAIMER</p>
                 </div>
              </div>
              <p className="text-xs text-zinc-500 font-medium italic leading-relaxed text-center md:text-left">
                 Bu web sitesi, yalnızca 18 yaş ve üzeri yetişkinlerin erişimine açık olan, bağımsız elit escort partnerlerin ilanlarını barındıran global bir katalog ve reklam ajansıdır. Sitede yer alan tüm profiller %100 gerçektir. <span className="text-(--primary-color) font-bold uppercase">Digital Identity Secured by Elit Seçki Network.</span>
              </p>
           </div>
        </div>

         {/* 🛡️ TRUST SIGNALS & POLICY NAVIGATION */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-zinc-900 mb-12 w-full">
           <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest italic text-zinc-500">
             <Link href="/gizlilik-politikasi" className="hover:text-(--primary-color) transition-colors">Gizlilik Politikası</Link>
             <Link href="/kvkk" className="hover:text-(--primary-color) transition-colors">KVKK Aydınlatma</Link>
             <Link href="/cerez-politikasi" className="hover:text-(--primary-color) transition-colors">Çerez Politikası</Link>
             <Link href="/hukuki-bilgilendirme" className="hover:text-(--primary-color) transition-colors">Hukuki Bilgilendirme</Link>
             <Link href="/sik-sorulan-sorular" className="hover:text-(--primary-color) transition-colors">S.S.S.</Link>
             <Link href="/telif-haklari" className="hover:text-(--primary-color) transition-colors">Telif Hakları</Link>
             <a href="/pdf/istanbul-vip-escort-katalogu.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-(--primary-color) transition-colors">VIP Partner Kataloğu (PDF)</a>
             <Link href="/hakkimizda" className="hover:text-(--primary-color) transition-colors">Hakkımızda</Link>
             <Link href="/iletisim" className="hover:text-(--primary-color) transition-colors">İletişim</Link>
           </div>
          <div className="flex items-center gap-3">
             <span className="text-[9px] font-black bg-zinc-950 px-5 py-2.5 border border-zinc-900 rounded-full text-zinc-600 uppercase tracking-widest italic">
               🔒 SSL SECURED 256-BIT
             </span>
          </div>
        </div>

         <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-[11px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">
                 © {currentYear} ⚡ DORUKCAN AY ⚡
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
        
        <LocalAuthority />
      </div>
    </footer>
  );
}
