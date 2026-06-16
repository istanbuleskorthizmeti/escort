'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  User, 
  ArrowRight,
  Headphones
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cities } from '@/lib/locations';
import { taxonomyCategories } from '@/lib/taxonomy';
import { siteConfig } from '@/config/site';
import { WhatsAppService } from '@/lib/crm/whatsapp';

/**
 * CONCIERGE AI - DRKCNAY Elite Protocol
 * A guided high-conversion funnel for VIP service requests.
 */
export const ConciergeChat = () => {
  const { 
    isChatOpen, setChatOpen, 
    chatMessages, addChatMessage, 
    chatStep, setChatStep,
    userSelections, updateUserSelection
  } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      // Use a local variable to avoid immediate state update that triggers cascading render
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          addChatMessage({
            role: 'assistant',
            content: 'DRKCNAY Elite Concierge hattına hoş geldiniz. Ben kişisel deneyim küratörünüzüm. Size en seçkin partner eşliğini planlamak ve kusursuz bir operasyon yönetmek için buradayım. Mevcut lokasyonunuzu belirtebilir misiniz?'
          });
          setIsTyping(false);
        }, 1200);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, chatMessages.length, addChatMessage]);

  const handleSelection = (type: string, value: string, label: string) => {
    // Add user message
    addChatMessage({ role: 'user', content: label });
    
    // Update state
    updateUserSelection({ [type]: value });
    
    // Logic for next step (FAST TRACK)
    setIsTyping(true);
    setTimeout(() => {
      if (type === 'city') {
        const cityName = cities[value]?.name;
        setChatStep('district');
        addChatMessage({
          role: 'assistant',
          content: `${cityName} harika bir tercih. Hangi bölge (ilçe) size daha yakın?`
        });
      } else if (type === 'district') {
        setChatStep('category');
        addChatMessage({
          role: 'assistant',
          content: 'Mükemmel. Aradığınız deneyim tarzı nedir? Size en uygun escort türünü seçin.'
        });
      } else if (type === 'category') {
        setChatStep('final');
        addChatMessage({
          role: 'assistant',
          content: 'Talebiniz elit standart ağımızda analiz edildi. Size en uygun premium profilleri WhatsApp üzerinden "VIP Elite" gizlilik standartlarıyla ileteceğim. Operasyonu başlatmak için onayınız gerekiyor.'
        });
      }
      setIsTyping(false);
    }, 400); // DRKCNAY: Reduced typing delay for faster VIP conversion
  };

  const handleWhatsAppRedirect = async () => {
    const { city, district, category } = userSelections;
    const cityName = cities[city || '']?.name || 'Belirtilmedi';
    const districtName = district ? district.replace('-', ' ').toUpperCase() : 'Merkez';
    const catName = category ? (taxonomyCategories[category]?.shortTitle || category) : 'VIP Hizmet';

    // DRKCNAY CRM: SECURE LEAD CAPTURE
    try {
      fetch('/api/crm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName,
          districtName,
          category: catName,
          details: `Source: Concierge AI Web. Region: ${cityName}/${districtName}. Tier: ${userSelections.tier || 'VIP'}`,
          currentUrl: window.location.href
        }),
        keepalive: true
      });
    } catch (e) {
      console.error('CRM Capture Failed (Silent):', e);
    }

    const message = WhatsAppService.generateEliteTemplate({
      city: city || 'Belirtilmedi',
      district: districtName,
      category: catName
    });
    
    const encodedMsg = encodeURIComponent(message);
    window.open(siteConfig.contact.whatsappLink, '_blank');
    setChatOpen(false);
  };

  if (!isChatOpen) {
    return (
      <button 
        onClick={() => setChatOpen(true)}
        title="Concierge Chat'i Aç"
        className="fixed bottom-6 right-6 z-[150] p-3.5 sm:p-4 bg-rose-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group ring-4 ring-rose-900/30"
      >
        <Headphones size={32} className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 z-[155] bg-black/60 backdrop-blur-sm md:hidden animate-fade-in-up" 
        onClick={() => setChatOpen(false)} 
        aria-hidden="true" 
      />
      
      {/* Bottom Sheet Container */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-24 md:right-6 z-[160] w-full md:w-[420px] max-h-[90vh] h-[85vh] md:h-[600px] bg-black/95 backdrop-blur-3xl border-t border-x md:border border-zinc-800/80 rounded-t-[2rem] md:rounded-3xl overflow-hidden flex flex-col animate-fade-in-up shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        {/* Mobile Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-zinc-950">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
        </div>
      
      {/* Header */}
      <div className="p-6 bg-rose-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles size={24} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black italic text-white tracking-widest uppercase text-sm">Concierge AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-zinc-100 font-bold uppercase">DRKCNAY Protocol Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setChatOpen(false)} 
          title="Kapat"
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'assistant' 
                ? 'bg-linear-to-br from-rose-600/10 to-black/40 border-l-[3px] border-l-rose-600 border-b border-b-rose-600/10 text-zinc-200' 
                : 'bg-zinc-900/30 border border-white/5 text-rose-500 font-bold'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-linear-to-br from-rose-600/10 to-black/40 border-l-[3px] border-l-rose-600 border-b border-b-rose-600/10 p-4 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </div>
          </div>
        )}

        {/* Dynamic Options */}
        {!isTyping && (
          <div className="flex flex-wrap gap-2 mt-4">
            {chatStep === 'welcome' && Object.values(cities).map((city) => (
              <button 
                key={city.slug}
                onClick={() => handleSelection('city', city.slug, city.name)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:border-rose-600 hover:text-white transition-all"
              >
                {city.name}
              </button>
            ))}

            {chatStep === 'district' && userSelections.city && cities[userSelections.city]?.districts.map((dist) => (
              <button 
                key={dist.slug}
                onClick={() => handleSelection('district', dist.slug, dist.name)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:border-rose-600 hover:text-white transition-all"
              >
                {dist.name}
              </button>
            ))}

            {chatStep === 'category' && Object.entries(taxonomyCategories).map(([slug, cat]) => (
              <button 
                key={slug}
                onClick={() => handleSelection('category', slug, cat.shortTitle)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:border-rose-600 hover:text-white transition-all"
              >
                {cat.shortTitle}
              </button>
            ))}

            {chatStep === 'final' && (
              <button 
                onClick={handleWhatsAppRedirect}
                className="w-full py-4 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all"
              >
                <ArrowRight className="w-6 h-6" />
                Görüşmeyi Başlat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-rose-600/10 flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-rose-500" />
          <span>Verified Partners</span>
        </div>
      </div>
    </div>
    </>
  );
};
