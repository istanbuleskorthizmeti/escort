"use client";

import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DRKCNAY GROWTH WIDGETS
 * High-conversion floating elements for Telegram and WhatsApp.
 */
export function GrowthWidgets() {
  const [showTelegram, setShowTelegram] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    const tgTimer = setTimeout(() => setShowTelegram(true), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(tgTimer);
    };
  }, []);

  return (
    <div className={cn(
      "fixed bottom-8 left-8 z-[100] flex flex-col gap-4 transition-all duration-1000",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    )}>
      
      {/* TELEGRAM BANNER (MINI) */}
      <div className={cn(
        "bg-black/90 backdrop-blur-2xl border border-zinc-800 p-4 rounded-3xl shadow-2xl flex items-center gap-4 transition-all duration-700 max-w-sm group",
        showTelegram ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      )}>
        <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.4)] group-hover:scale-110 transition-transform">
          <Send className="w-6 h-6 text-white fill-current" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-sky-400 tracking-widest uppercase mb-1">CANLI VIP KATALOG</div>
          <p className="text-zinc-200 text-xs font-bold leading-tight">Yüzlerce güncel çekim ve profil Telegram'da!</p>
          <a 
            href="https://t.me/eskortvipturkiye" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 text-[10px] font-black text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-full inline-flex items-center gap-2 transition-all"
          >
            KANALA KATIL <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button onClick={() => setShowTelegram(false)} className="text-zinc-600 hover:text-zinc-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* WHATSAPP FLOATING (PULSING) */}
      <a 
        href="/wa" 
        className="group relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-110 transition-all hover:rotate-6 active:scale-95"
      >
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        <MessageCircle className="w-8 h-8 text-white fill-current" />
        
        {/* TOOLTIP */}
        <div className="absolute left-20 bg-white text-black px-4 py-2 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-zinc-200">
          <span className="text-xs font-black tracking-tighter italic uppercase">VIP Konsiyerj (2010 Legacy)</span>
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-l border-b border-zinc-200"></div>
        </div>
      </a>

    </div>
  );
}
