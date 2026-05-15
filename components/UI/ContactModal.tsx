"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappLink: string;
  phoneNumber: string;
  title?: string;
}

export function ContactModal({ isOpen, onClose, whatsappLink, phoneNumber, title = "DRKCNAY ELITE DOĞRULAMA" }: ContactModalProps) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      timer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        {/* Glow Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#ff8600] to-transparent"></div>

        {/* Header */}
        <div className="p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#ff8600]/10 rounded-full flex items-center justify-center border border-[#ff8600]/20 shadow-[0_0_30px_rgba(255,134,0,0.2)]">
              <ShieldCheck className="w-10 h-10 text-[#ff8600] animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">
            {title}
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Nasıl İletişim Kurmak İstersiniz?
          </p>
        </div>

        {/* Options */}
        <div className="px-8 pb-10 space-y-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="group flex items-center gap-4 bg-linear-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white p-6 rounded-3xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-900/20"
          >
            <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 fill-white/10" />
            </div>
            <div className="text-left">
              <div className="font-black uppercase tracking-widest text-sm">WhatsApp ile Yaz</div>
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Anında Cevap Alın</div>
            </div>
          </a>

          <a
            href={`tel:${phoneNumber}`}
            className="group flex items-center gap-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-white p-6 rounded-3xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-[#ff8600]" />
            </div>
            <div className="text-left">
              <div className="font-black uppercase tracking-widest text-sm">Hemen Ara</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Sesli Rezervasyon</div>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="bg-black/40 p-6 text-center border-t border-white/5">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em]">
            Gizlilik ve Güvenlik Protokolü Aktif
          </p>
        </div>
      </div>
    </div>
  );
}
