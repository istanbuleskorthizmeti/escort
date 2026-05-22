'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CloakerSMM({ host }: { host: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Sistem Hazır. Hedef Bekleniyor...");
  const [platform, setPlatform] = useState('tiktok');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('10000');
  const [isStarted, setIsStarted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState(843);

  // Live visitor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  let title = "VIP Sosyal Medya Takipçi Hilesi 2026";
  
  if (host.includes('tiktok')) {
    title = "TikTok Ücretsiz Takipçi & Jeton Hilesi";
  } else if (host.includes('twitter') || host.includes('x')) {
    title = "X (Twitter) Retweet ve Takipçi Aracı";
  } else if (host.includes('instagram') || host.includes('insta')) {
    title = "Instagram Şifresiz Takipçi Gönderimi";
  } else if (host.includes('ifsa')) {
    title = "🔥 2026 Sansürsüz Türk İfşa & VIP Escort Gizli Çekimler";
  }

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Yavaş ilerleme (Dwell Time - Arama Motoru Manipülasyonu)
        const newP = p + Math.floor(Math.random() * 5) + 1;
        
        if (newP > 5 && newP < 20) {
          setStatus(`${platform.toUpperCase()} Graph API'ye Sızılıyor... [BAŞARILI]`);
          setLogs(l => [...l, `[SYS] Port 443 Handshake: OK`, `[API] Auth Token Bypass: SUCCESS`]);
        }
        if (newP > 20 && newP < 40) {
          setStatus(`@${username} Veritabanında Aranıyor... [BULUNDU]`);
          setLogs(l => [...l, `[DB] Scanning ${platform} Users...`, `[DB] User @${username} Localized.`]);
        }
        if (newP > 40 && newP < 60) {
          setStatus(`Bot Havuzundan ${amount} Aktif Hesap Çekiliyor...`);
          setLogs(l => [...l, `[POOL] Allocating ${amount} residential proxies...`, `[SYS] Injecting payload...`]);
        }
        if (newP > 60 && newP < 80) {
          setStatus("Sıraya Eklendi. Gönderim Başlıyor (Tahmini: 2-3 DK)...");
          setLogs(l => [...l, `[TRANSFER] Packet loss: 0%`, `[SYS] Ratelimit circumvented.`]);
        }
        if (newP > 80 && newP < 99) {
          setStatus("Cloudflare WAF (Güvenlik Duvarı) Bypass Ediliyor...");
          setLogs(l => [...l, `[WAF] Warning: Cloudflare CAPTCHA detected!`, `[WAF] Attempting JS challenge bypass...`]);
        }
        if (newP >= 100) {
          setStatus("GÜVENLİK ONAYI GEREKİYOR!");
          setLogs(l => [...l, `[WAF] BLOCK: Manuel doğrulama şart. İşlem duraklatıldı.`]);
        }
        
        return newP > 100 ? 100 : newP;
      });
    }, 1800); // Slower progress = more dwell time (SEO optimization)

    return () => clearInterval(timer);
  }, [isStarted, platform, username, amount]);

  return (
    <div className="min-h-screen bg-black/95 text-slate-300 font-sans flex flex-col items-center justify-center py-10 px-4 selection:bg-rose-600 selection:text-white relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-3xl bg-black/80 backdrop-blur-3xl border border-zinc-900 p-6 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden">
        
        {/* SMM Header */}
        <div className="text-center mb-8 border-b border-zinc-800 pb-6 relative">
          <div className="absolute right-0 top-0 flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-green-400">{visitorCount} Çevrimiçi</span>
          </div>

          <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse mt-8 md:mt-0">
            DRKCNAY V6.4 GÜNCEL ÇALIŞIYOR
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500 drop-shadow-md tracking-tight italic">{title}</h1>
          <p className="text-slate-400 mt-4 text-sm md:text-base max-w-xl mx-auto">Sistem %100 organik havuz mantığıyla çalışır. Hiçbir şifre girmeden, API açıklarını kullanarak profilinize etkileşim yollar.</p>
        </div>

        {!isStarted ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Hedef Platform Seçin</label>
              <div className="grid grid-cols-3 gap-3">
                {['tiktok', 'instagram', 'twitter'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`py-3 rounded-xl border font-bold capitalize transition-all ${platform === p ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Kullanıcı Adı (Şifre Gerekmez)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold group-focus-within:text-blue-500 transition-colors">@</span>
                <input 
                  type="text" 
                  placeholder="Kullanıcı Adınız" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Gönderilecek Miktar</label>
              <select 
                value={amount}
                title="Gönderilecek Miktar"
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="1000">1,000 Takipçi / Görüntülenme</option>
                <option value="5000">5,000 Takipçi / Görüntülenme</option>
                <option value="10000">10,000 Takipçi (Tavsiye Edilen)</option>
                <option value="25000">25,000 Takipçi (Riskli, Yavaş Gönderilir)</option>
              </select>
            </div>

            <button 
              onClick={() => {
                if (username.length > 2) setIsStarted(true);
                else alert("Lütfen geçerli bir kullanıcı adı girin.");
              }}
              className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] border border-white/10"
            >
              🚀 GÖNDERİMİ BAŞLAT
            </button>
          </div>
        ) : (
          <div className="bg-zinc-950/80 border border-zinc-800 p-6 md:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800/50 pb-6">
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Hedef Hesap</div>
                <div className="text-white font-black text-lg">@{username}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Miktar</div>
                <div className="text-green-400 font-black text-lg">+{amount}</div>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500 mb-6 drop-shadow-lg tabular-nums">
                {progress}%
              </div>
              
              <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden mb-8 shadow-inner border border-zinc-800">
                <div 
                  className="h-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-1500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              {/* Terminal Logs for Maximum Dwell Time */}
              <div className="bg-black border border-zinc-800 rounded-xl p-4 text-left font-mono text-xs md:text-sm h-32 overflow-y-auto mb-6 shadow-inner relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400 mb-1 opacity-80 animate-[fadeIn_0.2s_ease-in]">
                    <span className="text-zinc-500 mr-2">{'>'}</span>{log}
                  </div>
                ))}
                {progress < 100 && (
                  <div className="text-blue-400 mt-2 animate-pulse">
                    <span className="text-zinc-500 mr-2">{'>'}</span>{status}
                  </div>
                )}
                {progress === 100 && (
                  <div className="text-red-500 font-bold mt-2">
                    <span className="text-zinc-500 mr-2">{'>'}</span>{status}
                  </div>
                )}
              </div>
            </div>

            {/* FİNAL: YÖNLENDİRME (POP-UNDER & TELEGRAM TRAP) */}
            {progress === 100 && (
              <div className="mt-2 pt-6 border-t border-zinc-800/50 animate-[fadeIn_0.5s_ease-in-out]">
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-center mb-6 backdrop-blur-sm">
                  <h3 className="text-red-500 font-black mb-2 flex items-center justify-center gap-2 text-lg">
                    <span className="animate-pulse">⚠️</span> GÜVENLİK DOĞRULAMASI GEREKLİ
                  </h3>
                  <p className="text-zinc-400 text-sm">Sunucularımızdaki aşırı yoğunluk (Botnet Koruması) sebebiyle takipçilerin hesabınıza sorunsuz aktarılabilmesi için insan olduğunuzu doğrulamanız gerekmektedir.</p>
                </div>
                
                <button 
                  onClick={() => {
                    // Pop-Under: Escort PBN'i yeni sekmede aç (Trafik sızdırma)
                    window.open('https://istanbulescdrkcn.com', '_blank');
                    // Mevcut sekmeyi WhatsApp/Telegram hattına veya asıl sayfaya yönlendir
                    window.location.href = '/tg?ref=smm_verify';
                  }}
                  className="w-full block text-center bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] border border-white/10"
                >
                  🤖 ROBOT OLMADIĞIMI DOĞRULA (ZORUNLU)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 prose prose-invert text-[10px] text-slate-600 max-w-4xl text-center">
        TikTok takipçi hilesi 2026, şifresiz instagram beğeni, ücretsiz X (Twitter) retweet gönderme aracı. Bedava takipçi kazanma sitesi tamamen organik havuz mantığı ile çalışır. %100 güvenli ve şifre istemeyen takipçi gönderimi.
        
        {/* POPULAR BLOG POSTS (FOR BOT CRAWLING & INTERNAL LINKING) */}
        <div className="mt-8 border-t border-slate-800 pt-6">
           <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-4">SMM ve Sosyal Medya Rehberi</h3>
           <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
              <Link href="/blog/tiktok-takipci-hilesi-nasil-yapilir" className="text-blue-500 hover:text-blue-400 transition-colors">TikTok Takipçi Hilesi Nasıl Yapılır?</Link>
              <span className="text-slate-800">|</span>
              <Link href="/blog/instagram-organik-buyume-rehberi" className="text-blue-500 hover:text-blue-400 transition-colors">Instagram Organik Büyüme</Link>
              <span className="text-slate-800">|</span>
              <Link href="/blog/bedava-jeton-kazanma-taktikleri" className="text-blue-500 hover:text-blue-400 transition-colors">Bedava TikTok Jeton Kazanma</Link>
              <span className="text-slate-800">|</span>
              <Link href="/blog/twitter-trend-topic-olma-sirlari" className="text-blue-500 hover:text-blue-400 transition-colors">Twitter'da Trend Topic (TT) Olmak</Link>
           </div>
        </div>


      </div>
    </div>
  );
}
