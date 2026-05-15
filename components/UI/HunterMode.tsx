"use client";

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Download } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * 🎯 HUNTER MODE (AVCI MODU)
 * Gece saatlerinde (23:00 - 06:00) agresif "Hemen Ara" moduna geçer.
 * Gündüzleri klasik "WhatsApp" olarak çalışır.
 * Aynı zamanda PWA yükleme ekranı sunar.
 */
export function HunterMode() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Time Check (Avcı Modu tetikleyici)
    const checkTime = () => {
      const hour = new Date().getHours();
      // Gece 23:00 ile sabah 06:00 arası gece modu aktif
      setIsNightMode(hour >= 23 || hour < 6);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    // Entrance animation
    setTimeout(() => setIsVisible(true), 1500);

    // 2. PWA Install Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Sadece PWA tetiklendiğinde banner'ı göster
      setTimeout(() => setShowInstallBanner(true), 3000);
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const actionLink = isNightMode 
    ? `tel:+${siteConfig.contact.whatsappNumber}` 
    : siteConfig.contact.whatsappLink;

  return (
    <>
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 z-[300] bg-zinc-900/95 backdrop-blur-md border-b border-rose-900/50 p-4 transform transition-transform duration-500 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-rose-600/30 p-2 rounded-xl">
               <Download className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider">VIP Uygulamayı Kur</h4>
              <p className="text-zinc-400 text-xs">Tek tıkla güvenli ve gizli erişim.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-rose-500 transition-colors"
            >
              YÜKLE
            </button>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="p-2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* HUNTER BUTTON */}
      <div className={`fixed bottom-8 left-8 z-[150] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <a 
          href={actionLink}
          className={`group relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95 overflow-hidden ${isNightMode ? 'bg-rose-600 shadow-rose-600/40' : 'bg-[#25D366] shadow-[#25D366]/40'}`}
        >
          {/* Ping Effect */}
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isNightMode ? 'bg-rose-500' : 'bg-green-400'}`}></div>
          
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>

          {isNightMode ? (
            <Phone size={28} style={{ width: '28px', height: '28px' }} className="w-7 h-7 text-white fill-current relative z-10 animate-pulse" />
          ) : (
            <MessageCircle size={32} style={{ width: '32px', height: '32px' }} className="w-8 h-8 text-white fill-current relative z-10" />
          )}
          
          {/* TOOLTIP */}
          <div className="absolute left-20 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex flex-col">
            <span className={`text-[10px] font-black tracking-widest uppercase mb-0.5 ${isNightMode ? 'text-rose-500' : 'text-[#25D366]'}`}>
              {isNightMode ? 'GECE PROTOKOLÜ' : 'VIP KONSİYERJ'}
            </span>
            <span className="text-sm font-bold">
              {isNightMode ? 'Hemen Arayın' : 'WhatsApp Destek'}
            </span>
            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-zinc-900 rotate-45 border-l border-b border-zinc-800"></div>
          </div>
        </a>
      </div>
    </>
  );
}
