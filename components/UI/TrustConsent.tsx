'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Check, X } from 'lucide-react';

export function TrustConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    try {
      const consent = localStorage.getItem('Elit_cookie_consent');
      if (!consent) {
        // Delay showing the banner for premium micro-interaction feel
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('Elit_cookie_consent', 'granted');
      
      // Update Google Analytics Consent state dynamically
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    } catch (e) {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('Elit_cookie_consent', 'denied');
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-zinc-950/90 backdrop-blur-2xl border border-zinc-900 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-fade-in group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-(--primary-color)/20 to-amber-500/20 blur-md rounded-[2rem] -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--primary-color)/20 border border-(--primary-color)/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-(--primary-color) animate-pulse" />
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest italic">ÇEREZ &amp; KVKK AYDINLATMA</h4>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Güvenli ve Gizli Deneyim</p>
          </div>
        </div>

        <p className="text-zinc-400 text-[11px] leading-relaxed font-medium italic">
          Bu platform, kullanıcı deneyimini optimize etmek, site trafiğini analiz etmek ve güvenli VIP rehber hizmetlerimizi en yüksek gizlilik standartlarında sunmak amacıyla çerezler (cookies) kullanmaktadır. Detaylı bilgi için{' '}
          <Link href="/kvkk" className="text-white hover:text-(--primary-color) underline transition-colors">
            KVKK Aydınlatma Metni
          </Link>{' '}
          ve{' '}
          <Link href="/cerez-politikasi" className="text-white hover:text-(--primary-color) underline transition-colors">
            Çerez Politikası
          </Link>{' '}
          sayfalarımızı inceleyebilirsiniz.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-(--primary-color) hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest italic py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20"
          >
            <Check className="w-3.5 h-3.5" /> KABUL ET
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-widest italic rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <X className="w-3.5 h-3.5" /> REDDET
          </button>
        </div>
      </div>
    </div>
  );
}
