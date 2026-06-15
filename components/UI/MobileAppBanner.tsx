'use client';

import React, { useState, useEffect } from 'react';

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('mobile_app_banner_dismissed');
    if (!isDismissed) {
      // Delay showing the banner slightly for better UX/feeling
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('mobile_app_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const whatsappNumber = "+12495448982";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Merhaba, mobil uygulama üzerinden VIP randevu talebi oluşturmak istiyorum.")}`;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-[slideUp_0.4s_ease-out] pointer-events-auto">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950/80 p-4 border border-white/10 backdrop-blur-xl shadow-2xl shadow-rose-950/20">
        
        {/* Glow effect */}
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white font-extrabold text-lg shadow-lg shadow-rose-500/30">
              DRK
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
                Dorukcanay VIP App
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  AKTİF
                </span>
              </h4>
              <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1">
                Kaporasız VIP randevu cebinde!
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all duration-300 min-h-[44px] flex items-center justify-center"
            >
              YÜKLE
            </a>
            
            <button
              onClick={handleDismiss}
              className="p-3 text-zinc-400 hover:text-white transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
