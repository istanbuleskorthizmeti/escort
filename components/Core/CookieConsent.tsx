"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "Elit_cookie_consent" as const;

type ConsentStatus = "granted" | "denied" | null;

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "granted" || stored === "denied") return stored;
  return null;
}

function updateGtagConsent(status: "granted" | "denied") {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
  };
  
  // Crawler Camouflage: automatically upgrade tracking privileges for crawlers
  const ua = navigator.userAgent.toLowerCase();
  const isBot = /googlebot|bingbot|yandexbot|google-adwords|google-adsense|baiduspider|duckduckbot/i.test(ua);
  const finalStatus = isBot ? "granted" : status;

  w.gtag?.("consent", "update", {
    analytics_storage: finalStatus,
    ad_storage: finalStatus,
    ad_user_data: finalStatus,
    ad_personalization: finalStatus,
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    
    // Completely hide the cookie banner from crawler bots to avoid CLS (Cumulative Layout Shift) penalties
    const ua = navigator.userAgent.toLowerCase();
    const isBot = /googlebot|bingbot|yandexbot|google-adwords|google-adsense|baiduspider|duckduckbot/i.test(ua);
    if (isBot) return false;

    return getStoredConsent() === null;
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored !== null) {
      updateGtagConsent(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    updateGtagConsent("granted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    updateGtagConsent("denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-9999 p-4 animate-[slideUp_0.4s_ease-out]"
      role="dialog"
      aria-label="Çerez Onayı"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-black/90 backdrop-blur-2xl p-5 shadow-2xl shadow-rose-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm not-italic text-zinc-300 leading-relaxed">
            🔒 Bu site, deneyiminizi iyileştirmek için çerezler kullanır.{" "}
            <span className="text-zinc-500">
              KVKK kapsamında verileriniz korunmaktadır.
            </span>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleReject}
              className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold not-italic text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              className="cursor-pointer rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold not-italic text-white transition-all hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-600/30"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
