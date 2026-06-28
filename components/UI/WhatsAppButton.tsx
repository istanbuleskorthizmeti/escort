"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  const pathname = usePathname() || "";
  
  const handleClick = () => {
    try {
      let intentData = {};
      if (typeof window !== "undefined") {
        const intentRaw = sessionStorage.getItem("DRKCNAY_intent");
        if (intentRaw) intentData = JSON.parse(intentRaw);
      }
      fetch('/api/crm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: 'Site Geneli',
          districtName: 'Genel',
          category: 'DIRECT_WHATSAPP',
          details: 'Source: Floating WhatsApp Butonu',
          currentUrl: window.location.href,
          ...intentData
        }),
        keepalive: true
      });
    } catch (e) {
      console.error('Tracking failed', e);
    }
  };

  // SADECE Istanbul, Tekirdag, Gebze ve Anasayfa'da gosterilecek.
  const isVIPLocation = pathname === "/" || pathname.includes("/istanbul") || pathname.includes("/tekirdag") || pathname.includes("/gebze");

  if (!isVIPLocation) return null;

  return (
    <a
      href={siteConfig.contact.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-150 group"
    >
      <div className="relative flex items-center justify-center">
        {/* Elite Ambient Glow */}
        <div className="absolute inset-0 bg-rose-600 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-700" />
        
        {/* Supreme Capsule Button */}
        <div className="relative bg-black/90 border border-zinc-800/80 hover:border-rose-900/60 p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex items-center gap-3 backdrop-blur-2xl">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 group-hover:text-rose-400 transition-colors" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 transition-all duration-500 group-hover:max-w-xs group-hover:pr-3 group-hover:text-zinc-100">
            Hızlı Rezervasyon
          </span>
        </div>

        {/* Dynamic Pulse Indicator & Phantom Notification */}
        <div className="absolute -top-1 -right-1 z-20">
          <div className="bg-rose-600 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-glow-sm animate-pulse-notification border border-black">
            1
          </div>
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-black shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
      </div>
    </a>
  );
}
