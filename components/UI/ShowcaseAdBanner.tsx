'use client';

import React, { useState } from 'react';

export function ShowcaseAdBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const whatsappNumber = "573009000676";
  const message = "Merhaba, vitrin reklamı vermek istiyorum.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="relative z-50 w-full bg-zinc-950 border-b border-rose-500/20 shadow-[0_2px_15px_rgba(244,63,94,0.1)]">
      {/* Background neon flow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-[pulse_2s_infinite]" />
      
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Dynamic advertising notification link */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center group cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          
          <span className="text-zinc-200 text-xs sm:text-sm font-semibold tracking-wide group-hover:text-rose-400 transition-colors duration-200">
            Vitrin Reklamı Vermek İçin <span className="underline decoration-rose-500/50 decoration-2 underline-offset-4 text-rose-400 font-bold group-hover:text-rose-300">Tıklayınız</span>
          </span>
          
          <span className="hidden md:inline text-zinc-500 text-xs">|</span>
          
          <span className="text-zinc-400 text-xs sm:text-sm font-medium">
            İlan Başvurusu İçin WhatsApp: 
            <span className="ml-1 text-white font-semibold group-hover:text-rose-300 transition-colors duration-200">
              +57 300 9000676
            </span>
          </span>
        </a>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-zinc-500 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 cursor-pointer flex-shrink-0"
          aria-label="Kapat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
