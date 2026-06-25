'use client';

import React, { useState, useEffect } from 'react';

export function ShowcaseAdBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the banner with a slight delay for smooth introduction
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const whatsappNumber = "573009000676";
  const message = "Merhaba, vitrin reklamı vermek istiyorum.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-[slideUp_0.4s_ease-out] pointer-events-auto">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950/90 p-4 border border-rose-500/20 backdrop-blur-xl shadow-2xl shadow-rose-950/30">
        
        {/* Neon Glow background elements */}
        <div className="absolute -left-8 -top-8 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          
          {/* Main Clickable WhatsApp Direct Link */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center gap-3 group"
          >
            {/* Pulsing Active Icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-sm shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              AD
            </div>
            
            <div className="flex-1">
              <h4 className="text-white font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 group-hover:text-rose-400 transition-colors duration-200">
                Vitrin'e İlan Eklemek İçin
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h4>
              <p className="text-zinc-400 text-xs mt-0.5 group-hover:underline decoration-rose-500/30 underline-offset-2">
                İletişime Geçin! <span className="text-rose-400 font-bold">(WhatsApp)</span>
              </p>
            </div>
          </a>

          {/* Close Action Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-zinc-500 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 cursor-pointer flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
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
  );
}
