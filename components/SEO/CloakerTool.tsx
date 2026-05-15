'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function CloakerTool({ host }: { host: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Sistem hazırlanıyor...");
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const isHackTool = host.includes('hilesi') || host.includes('casus') || host.includes('hack') || host.includes('coz') || host.includes('sifre');
  const isQueryTool = host.includes('sorgula') || host.includes('bulucu') || host.includes('hesap');
  
  let title = "Canlı Yayın & Full APK Merkezi";
  let targetAction = "Dosyaları Çıkart";
  
  if (isHackTool) {
    title = "Gelişmiş Algoritma ve Güvenlik Aracı v2.4";
    targetAction = "Hack İşlemini Başlat";
  } else if (isQueryTool) {
    title = "Ulusal Veritabanı Sorgulama Sistemi";
    targetAction = "Sorgulamayı Başlat";
  } else if (host.includes('ifsa')) {
    title = "🔥 2026 Sansürsüz Türk İfşa & VIP Escort Gizli Çekimler";
    targetAction = "VİDEOYU AÇ";
  }

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    // Initial logs
    addLog("Offshore sunucuya bağlanılıyor (TCP/IP: 213.232.235.181)...");
    addLog("IP Adresiniz Gizlendi (VPN Aktif).");
    
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Slower progression to increase dwell time (Google metric hack)
        const newP = p + Math.floor(Math.random() * 8) + 2;
        
        if (newP > 10 && newP < 30) {
           setStatus("Cloudflare WAF Bypass ediliyor...");
           if (Math.random() > 0.7) addLog("WAF Kural seti atlanıyor... [BAŞARILI]");
        }
        if (newP > 30 && newP < 50) {
           setStatus("Hedef sunucuya ping atılıyor... [OK]");
           if (Math.random() > 0.6) addLog("Hedef veritabanı tespit edildi: MySQL 8.0");
        }
        if (newP > 50 && newP < 70) {
           setStatus("Veritabanı bağlantısı kuruluyor (Port 3306)...");
           if (Math.random() > 0.5) addLog("Handshake paketi gönderildi... Kimlik doğrulama bypass ediliyor.");
        }
        if (newP > 70 && newP < 90) {
           setStatus("MD5 şifreleri kırılıyor (Brute Force Devrede)...");
           if (Math.random() > 0.4) addLog(`Hash bulundu: ${Math.random().toString(36).substring(2, 15)}... Çözümleniyor.`);
        }
        if (newP > 90 && newP < 100) {
           setStatus("Veriler paketleniyor...");
           if (Math.random() > 0.5) addLog("Sonuç dosyası (.txt) oluşturuluyor...");
        }
        if (newP >= 100) {
           setStatus("İŞLEM BAŞARILI! Doğrulama Bekleniyor.");
           addLog("!!! İŞLEM TAMAMLANDI !!!");
           addLog("Bot kontrolünden geçmeniz gerekmektedir.");
        }
        
        return newP > 100 ? 100 : newP;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono flex flex-col items-center justify-center p-4 selection:bg-[#00ff00] selection:text-black relative">
      <div className="w-full max-w-3xl border border-[#00ff00]/40 bg-black/80 p-6 md:p-10 rounded shadow-[0_0_50px_rgba(0,255,0,0.1)] relative z-10 backdrop-blur-md">
        
        {/* Decorative terminal header */}
        <div className="border-b border-[#00ff00]/30 pb-4 mb-6 flex justify-between items-end relative">
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">{title}</h1>
            <div className="text-[10px] md:text-xs text-[#00ff00]/70 mt-2 flex gap-4">
              <span>TARGET_HOST: <strong className="text-white">{host.toUpperCase()}</strong></span>
              <span>SECURE: <strong className="text-[#00ff00]">ESTABLISHED</strong></span>
            </div>
          </div>
          <div className="text-xs animate-pulse hidden sm:block bg-[#00ff00] text-black px-2 py-0.5 font-bold">ROOT_ACCESS</div>
        </div>

        {/* Input area (fake) */}
        <div className="mb-6 bg-zinc-900/50 p-4 border border-zinc-800 rounded">
          <label className="block text-sm mb-3 text-[#00ff00]/90 font-bold">&gt; Hedef ID / Kullanıcı Adı / Numara giriniz:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              readOnly 
              title="Hedef ID"
              placeholder="_"
              value="********" 
              className="bg-black border border-[#00ff00]/50 text-[#00ff00] px-4 py-3 w-full focus:outline-none opacity-80 cursor-not-allowed font-black tracking-widest"
            />
            <button className="bg-[#00ff00]/20 border border-[#00ff00] px-8 py-3 hover:bg-[#00ff00] hover:text-black font-black transition-colors cursor-not-allowed opacity-50 whitespace-nowrap shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              {targetAction}
            </button>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="bg-zinc-950 border border-[#00ff00]/30 p-4 md:p-6 mb-8 font-mono shadow-[inset_0_0_30px_rgba(0,255,0,0.05)] rounded relative">
          <div className="absolute top-0 right-0 bg-[#00ff00]/20 text-[#00ff00] px-2 py-1 text-[10px] font-bold">TERMINAL v2.1.0</div>
          
          <div className="h-40 overflow-y-auto mb-4 text-xs md:text-sm text-[#00ff00]/70 pr-2 scrollbar-thin scrollbar-thumb-[#00ff00]/20">
             {logs.map((log, i) => (
                <div key={i} className="mb-1 leading-relaxed">
                   {log.includes('BAŞARILI') || log.includes('TAMAMLANDI') ? (
                     <span className="text-white font-bold bg-[#00ff00]/20 px-1">{log}</span>
                   ) : log.includes('Bypass') || log.includes('Brute') ? (
                     <span className="text-yellow-400">{log}</span>
                   ) : (
                     log
                   )}
                </div>
             ))}
             <div ref={logsEndRef} />
          </div>

          <div className="text-[#00ff00] mb-4 font-bold flex gap-2 border-t border-[#00ff00]/20 pt-4">
            <span className="animate-pulse">&gt;</span> 
            {status}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-2 text-xs font-bold">
              <span>CPU/RAM YÜKÜ</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="w-full bg-black border border-[#00ff00]/50 h-8 p-1">
              <div 
                className="bg-gradient-to-r from-[#00ff00]/50 to-[#00ff00] h-full transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.8)] relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Stripe Effect */}
                <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] animate-[pan_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action (Redirect to money site via WA trap) */}
        {progress === 100 && (
          <div className="text-center animate-[scaleIn_0.5s_ease-out] mt-6">
            <div className="bg-red-900/40 border border-red-500 p-6 mb-6 rounded relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
              <p className="text-white font-black text-lg md:text-xl uppercase tracking-wider drop-shadow-md mb-2 flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-red-500 animate-bounce" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                DİKKAT: BOT OLMADIĞINIZI DOĞRULAYIN
              </p>
              <p className="text-red-200 text-sm font-semibold">
                Sistem dosyaları (.txt / .zip) sunucuda hazır. İndirme işlemine başlamak veya sonuçları görüntülemek için insan olduğunuzu doğrulamanız gerekmektedir. 
                Aşağıdaki butona tıklayarak ücretsiz doğrulama adımına geçiniz.
              </p>
            </div>
            <Link 
              href="/tg?ref=tool_verify_click" 
              className="group relative inline-flex items-center justify-center bg-black text-[#00ff00] font-black text-lg md:text-xl uppercase tracking-widest px-10 py-5 transition-all border-2 border-[#00ff00] hover:bg-[#00ff00] hover:text-black shadow-[0_0_30px_rgba(0,255,0,0.3)] hover:shadow-[0_0_50px_rgba(0,255,0,0.8)] w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                 SONUÇLARI İNDİR / DOĞRULA
                 <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 text-center max-w-4xl text-[11px] text-[#00ff00]/40 relative z-10 leading-relaxed px-4 p-4 border border-[#00ff00]/10 bg-black/50 backdrop-blur-sm rounded">
        Bu sistem yalnızca eğitim ve sızma testi (penetration testing) amaçlıdır. {host.toUpperCase()} üzerinden yapılan işlemlerin sorumluluğu tamamen son kullanıcıya aittir. Sistemimiz KVKK ve GDPR uyumlu offshore logsuz proxy sunucuları üzerinden çalışmaktadır. Tersine mühendislik veya yasadışı işlemler tespit edildiğinde IP adresiniz yetkili mercilerle paylaşılabilir. İzinsiz kopyalanması yasaktır.
      </div>
      
      {/* Background Matrix/Hacker Effect */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black via-[#00ff00]/5 to-black pointer-events-none z-0"></div>
      
      {/* Aggressive SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": title,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web, Android, iOS, Windows, macOS",
          "url": `https://${host}`,
          "description": "2026 güncel algoritma ile çalışan online sorgulama, analiz ve şifre kırıcı araç. Saniyeler içinde sonuç veren ultra hızlı veritabanı altyapısı.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
          }
        }) }}
      />
    </div>
  );
}
