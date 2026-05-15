"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Phone, Shield, X, MoreVertical } from "lucide-react";
import { siteConfig } from "@/config/site";

export function DRKCNAYActionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const actions = [
    {
      id: "whatsapp",
      name: "WhatsApp Destek",
      icon: <MessageCircle className="w-5 h-5" />,
      link: siteConfig.contact.whatsappLink,
      color: "bg-[#1e7e34]",
      label: "VIP İletişim"
    },
    {
      id: "telegram",
      name: "Telegram VIP Grup",
      icon: <Send className="w-5 h-5" />,
      link: siteConfig.contact.telegramGroupLink,
      color: "bg-[#0088cc]",
      label: "VIP Katılım"
    },
    {
      id: "call",
      name: "Hızlı Arama",
      icon: <Phone className="w-5 h-5" />,
      link: `tel:+${siteConfig.contact.whatsappNumber}`,
      color: "bg-[#ff8600]",
      label: "7/24 Arama"
    }
  ];

  const handlePanic = () => {
    window.location.href = "https://www.google.com/search?q=hava+durumu";
  };

  return (
    <div className="fixed bottom-6 right-6 z-200 flex flex-col items-end gap-4">
      {/* Action Menu Items */}
      <div className={`flex flex-col gap-3 transition-all duration-500 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"}`}>
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <span className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {action.label}
            </span>
            <div className={`${action.color} p-4 rounded-full text-white shadow-lg hover:scale-110 active:scale-95 transition-transform`}>
              {action.icon}
            </div>
          </a>
        ))}
        
        {/* Integrated Panic Button */}
        <button
          onClick={handlePanic}
          className="flex items-center gap-3 group"
        >
          <span className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff8600] opacity-0 group-hover:opacity-100 transition-opacity">
            Hızlı Çıkış
          </span>
          <div className="bg-zinc-900 p-4 rounded-full text-[#ff8600] border border-[#ff8600]/20 shadow-lg hover:bg-[#ff8600] hover:text-white transition-all">
            <Shield className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-5 rounded-full shadow-2xl transition-all duration-700 ${isOpen ? "bg-zinc-900 rotate-180" : "bg-[#ff8600] animate-slow-glow"}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <div className="flex items-center gap-2">
             <MoreVertical className="w-8 h-8 text-white" />
             <span className="absolute -top-1 -right-1 bg-white text-[#ff8600] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#ff8600]">3</span>
          </div>
        )}
      </button>
    </div>
  );
}
