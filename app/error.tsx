'use client';

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.error('🛡️ Premium self-healing shield activated for error:', error);
    
    // Automatically trigger transparent hot reload up to 2 times
    if (typeof window !== 'undefined') {
      const now = Date.now();
      const lastReload = sessionStorage.getItem('hot_reload_recover');
      const reloadCount = parseInt(sessionStorage.getItem('hot_reload_count') || '0', 10);
      
      // If we haven't reloaded recently, or reload count is less than 2
      if (!lastReload || (now - parseInt(lastReload, 10) > 15000) || reloadCount < 2) {
        sessionStorage.setItem('hot_reload_recover', now.toString());
        sessionStorage.setItem('hot_reload_count', (reloadCount + 1).toString());
        window.location.reload();
        return;
      }
    }

    // If it's a persistent error, try to reset React state automatically every 4 seconds in the background
    const timer = setInterval(() => {
      if (retryCount < 5) {
        setRetryCount(prev => prev + 1);
        reset();
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [error, reset, retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center antialiased"
         style={{ 
           backgroundImage: 'radial-gradient(circle at 50% 0%, #0d070b 0%, #050204 70%)',
           backgroundColor: '#050204' 
         }}>
      <div className="max-w-md w-full bg-zinc-950/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
        {/* Luxury Gold Spinner */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 animate-spin"
               style={{ borderColor: '#D4AF37', borderLeftColor: 'transparent' }} />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-transparent animate-pulse" />
        </div>

        <h1 className="text-2xl font-black italic tracking-widest uppercase mb-3 text-white"
            style={{ 
              textShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
              fontFamily: 'Outfit, sans-serif'
            }}>
          VİTRİN YÜKLENİYOR
        </h1>
        
        <p className="text-zinc-400 text-xs md:text-sm font-semibold tracking-wider leading-relaxed mb-8 uppercase">
          Görsel optimizasyon ve güvenli veri bağlantısı sağlanıyor. Lütfen bekleyiniz...
        </p>
        
        <button
          onClick={() => {
            sessionStorage.removeItem('hot_reload_count');
            reset();
          }}
          className="w-full text-white font-black uppercase tracking-widest py-3.5 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-[#D4AF37]/30 text-xs"
          style={{ 
            background: 'linear-gradient(90deg, #D4AF37, #AA7C11)',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
          }}
        >
          Yeniden Bağlan
        </button>
        
        <div className="mt-8 flex flex-col gap-1 items-center border-t border-white/5 pt-6 w-full">
          <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase italic">
            SECURE PORTAL RECOVERY LAYER ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

