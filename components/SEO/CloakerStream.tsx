'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CloakerStream({ host }: { host: string }) {
  const [viewers, setViewers] = useState(14582);
  const [chatMessages, setChatMessages] = useState<{user: string, text: string, color: string}[]>([]);
  const isSports = host.includes('mac') || host.includes('spor') || host.includes('yayin') || host.includes('oyun');
  
  let title = "Canlı Yayın: Galatasaray - Fenerbahçe Derbisi (Şifresiz)";
  let category = "SPOR YAYINI";
  let description = "Kesintisiz, donmayan HD kalitesinde canlı derbi yayını. Taraftarium24, SelçukSports, Exxen ücretsiz maç izle.";
  
  if (!isSports) {
    if (host.includes('dizi') || host.includes('fragman')) {
      title = "Yalı Çapkını 104. Bölüm Full HD Sansürsüz İzle";
      category = "DİZİ / FİLM";
      description = "En son çıkan dizileri ve vizyondaki filmleri Netflix, BluTV, Exxen kalitesinde ücretsiz, reklamsız ve kesintisiz izleyin.";
    } else {
      title = "🔥 2026 Sansürsüz Türk İfşa & VIP Escort Gizli Çekimler";
      category = "VİDEO İZLE";
      description = "En güncel sansürsüz videoları reklamsız izleyin.";
    }
  }

  // Sahte Canlı Sohbet Simülasyonu
  useEffect(() => {
    const userNames = ["BordoMavi", "UltraAslan", "KoyuFener", "KartalYuvasi", "SerseriGenc", "DiziKurdu", "Cengo", "Kral34", "AnonimIzleyici"];
    const messages = isSports 
      ? ["Yayın harika, donma yok!", "Goooolll!", "Hakem napıyor ya?", "Kral link için eyvallah", "HD kalite efsane", "Maç gidiyor gençler", "Reklamsız maç keyfi mis"]
      : ["Bu bölüm çok fena", "Sansürsüz olması efsane", "Sonunda reklamsız site buldum", "Görüntü kalitesi 1080p cidden", "Diğer sitelerde hep donuyordu", "VIP üyelik aldım çok hızlı iniyor"];
    const colors = ["text-red-500", "text-blue-500", "text-yellow-500", "text-green-500", "text-purple-500", "text-pink-500"];

    const interval = setInterval(() => {
      setChatMessages(prev => {
        const newMessage = {
          user: userNames[Math.floor(Math.random() * userNames.length)],
          text: messages[Math.floor(Math.random() * messages.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        const updated = [...prev, newMessage];
        return updated.length > 7 ? updated.slice(updated.length - 7) : updated;
      });
      
      // İzleyici sayısını dalgalandır (Gerçekçilik için)
      setViewers(prev => prev + Math.floor(Math.random() * 50) - 20);
    }, 2500);

    return () => clearInterval(interval);
  }, [isSports]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-[#ff0000]">
      {/* Fake Header */}
      <header className="bg-black border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              {isSports ? '⚽' : '🎬'}
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {host.split('.')[0]}<span className="text-red-500">.STREAM</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-red-900/30 text-red-500 px-3 py-1 rounded font-bold text-sm border border-red-900/50">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              CANLI YAYIN
            </div>
            <Link href="/tg?ref=stream_login" className="bg-[#0088cc] text-white hover:bg-[#0077b5] px-5 py-1.5 rounded text-sm font-black transition-all shadow-[0_0_15px_rgba(0,136,204,0.4)] flex items-center gap-2">
              <svg className="w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              TELEGRAM KANALI
            </Link>
          </div>
        </div>
      </header>

      {/* Main Streaming Area */}
      <main className="max-w-7xl mx-auto px-0 sm:px-4 py-4 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Col: Video Player */}
        <div className="w-full lg:w-3/4">
          <div className="mb-4 px-4 sm:px-0">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold text-zinc-400">
              <span className="bg-zinc-800 px-2 py-0.5 rounded">{category}</span>
              <span>•</span>
              <span className="text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3" width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                {viewers.toLocaleString()} İzleyici
              </span>
              <span>•</span>
              <span className="text-green-500">HD 1080p</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{title}</h1>
          </div>

          {/* FAKE VIDEO PLAYER (THE TRAP TO TELEGRAM/PBN) */}
          <div 
            className="block relative aspect-video bg-black rounded-none sm:rounded-xl overflow-hidden group cursor-pointer border border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            onClick={() => {
              // Pop-under Traffic Siphoning -> Escort Network
              window.open('https://vipescorthizmeti.shop', '_blank');
              // Primary Action -> Telegram Leak Group
              window.location.href = '/tg?ref=stream_video_click';
            }}
          >
            
            {/* Loading/Buffer Animation (Brings realism) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/60">
              <div className="w-16 h-16 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin mb-4"></div>
              <div className="bg-red-600 text-white font-black px-6 py-2 rounded shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-pulse flex items-center gap-2">
                <svg className="w-5 h-5" width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                YAYINI TELEGRAM'DA İZLE
              </div>
              <p className="text-zinc-300 text-xs mt-3 font-medium">Bağlantı kuruluyor... İzlemek için tıklayın.</p>
            </div>

            {/* Fake Controls UI */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-1 bg-zinc-800 rounded mb-4 overflow-hidden">
                <div className="w-1/3 h-full bg-red-500"></div>
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex gap-4">
                  <svg className="w-6 h-6 hover:text-red-500" width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  <svg className="w-6 h-6 hover:text-red-500" width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                  <span className="text-sm font-bold">CANLI</span>
                </div>
                <div className="flex gap-4">
                  <span className="bg-red-600 px-1 rounded text-[10px] font-bold">HD</span>
                  <svg className="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0"></div>
          </div>

          {/* Social Proof & Description */}
          <div className="mt-6 px-4 sm:px-0 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-2 text-zinc-100">{description}</h2>
            <p className="text-sm text-zinc-400 mb-4">Bu yayını kesintisiz ve takılmadan izlemek için yüksek hızlı sunucularımız aktiftir. Yoğunluktan etkilenmemek için lütfen alternatif Telegram giriş bağlantılarını kullanınız.</p>
            
            <div className="flex gap-3 mt-6">
              <Link href="/tg?ref=stream_alt_1" className="flex-1 bg-zinc-800 hover:bg-[#0088cc] text-center py-3 rounded border border-zinc-700 font-bold transition-colors text-sm">Alternatif Link (Telegram)</Link>
              <Link href="/tg?ref=stream_alt_2" className="flex-1 bg-zinc-800 hover:bg-[#0088cc] text-center py-3 rounded border border-zinc-700 font-bold transition-colors text-sm">Kesintisiz Sunucu (VIP)</Link>
            </div>
          </div>
        </div>

        {/* Right Col: Fake Live Chat */}
        <div className="w-full lg:w-1/4 h-[500px] lg:h-auto bg-[#161b22] border border-zinc-800 rounded-xl flex flex-col mt-4 lg:mt-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-400" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
              Canlı Sohbet
            </h3>
            <span className="text-xs text-zinc-500 font-medium">{viewers.toLocaleString()} kişi</span>
          </div>
          
          <div className="flex-1 p-4 overflow-hidden flex flex-col justify-end gap-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="text-sm animate-[fadeIn_0.3s_ease-in-out]">
                <span className={`${msg.color} font-bold mr-2`}>{msg.user}:</span>
                <span className="text-zinc-300">{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 rounded-b-xl">
            <div className="bg-zinc-800 border border-zinc-700 rounded p-3 text-sm text-zinc-500 cursor-not-allowed">
              Sohbete katılmak için giriş yapın...
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Black SEO Content for Spiders */}
      <div className="prose prose-invert max-w-none text-zinc-500/20 text-[10px] p-10 mt-10 relative overflow-hidden">
        Bedava maç izle, canlı yayın linkleri, taraftarium24, selçuksports hd, inat tv pro apk, beinsports şifresiz bedava, kaçak maç siteleri 2026. 
        Kesintisiz derbi izle galatasaray fenerbahçe beşiktaş trabzonspor canlı maç izle şifresiz bedava linkleri hd donmadan yayın. 
        {host} {isSports ? 'spor ve maç özetleri' : 'dizi izle kaçak film siteleri türkçe dublaj alt yazılı 1080p hd sinema çekimi olmayan netflix filmleri bedava izle apk.'}
        
        {/* POPULAR BLOG POSTS (FOR BOT CRAWLING & INTERNAL LINKING) */}
        <div className="mt-8 border-t border-zinc-800/20 pt-6">
           <h3 className="text-zinc-600 font-bold uppercase tracking-widest mb-4">Son Haberler ve Yayın İncelemeleri</h3>
           <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
              <Link href="/blog/canli-mac-izleme-siteleri-2026" className="text-zinc-400 hover:text-zinc-300 transition-colors">Canlı Maç İzleme Siteleri 2026</Link>
              <span className="text-zinc-800">|</span>
              <Link href="/blog/bedava-lig-tv-yayinlari-nasil-bulunur" className="text-zinc-400 hover:text-zinc-300 transition-colors">Bedava Lig TV Yayınları</Link>
              <span className="text-zinc-800">|</span>
              <Link href="/blog/netflix-yeni-sezon-dizileri-bedava-izle" className="text-zinc-400 hover:text-zinc-300 transition-colors">Netflix Yeni Sezon Bedava İzle</Link>
              <span className="text-zinc-800">|</span>
              <Link href="/blog/taraftarium24-ve-selcuksports-alternatifleri" className="text-zinc-400 hover:text-zinc-300 transition-colors">Taraftarium24 ve SelçukSports Alternatifleri</Link>
           </div>
        </div>

        {/* 🕷️ BLACK SEO: HIDDEN PBN DOMAIN AUTHORITY TRANSFER */}
        <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
            <a href="https://kadikoyescort.shop" title="Kadıköy Escort" rel="dofollow">Kadıköy Escort</a>
            <a href="https://istanbulescorthizmeti.shop" title="İstanbul Escort Hizmeti" rel="dofollow">İstanbul Escort</a>
            <a href="https://besiktasescort.fun" title="Beşiktaş Escort" rel="dofollow">Beşiktaş Escort</a>
        </div>
      </div>

      {/* Structured Data for SEO Manipulation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": isSports ? "SportsEvent" : "Movie",
          "name": title,
          "description": description,
          "url": `https://${host}`,
          "location": {
            "@type": "VirtualLocation",
            "url": `https://${host}`
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY",
            "availability": "https://schema.org/InStock"
          }
        }) }}
      />
    </div>
  );
}
