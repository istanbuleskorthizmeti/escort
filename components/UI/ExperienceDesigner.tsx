"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ShieldCheck, MapPin, Loader2, Sparkles, UserCheck } from "lucide-react";

export function ExperienceDesigner({ neighborhood, district }: { neighborhood: string; district: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setLoading(true);
      setTimeout(() => {
        setStep(prev => prev + 1);
        setLoading(false);
      }, 800);
    } else {
      // Step 3: Encrypted Handshake
      setLoading(true);
      setTimeout(() => {
        window.location.href = siteConfig.contact.whatsappLink;
      }, 1500);
    }
  };

  return (
    <div className="w-full bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 md:p-20 overflow-hidden relative shadow-2xl group hover:border-rose-600 transition-all duration-1000">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-600/5 blur-[120px] rounded-full group-hover:bg-rose-600/10 transition-colors"></div>

      <div className="flex justify-between items-center mb-16">
        <h3 className="text-3xl font-black italic uppercase text-white tracking-widest flex items-center gap-4">
          <Sparkles className="w-6 h-6 text-rose-600" />
          Standart <span className="text-rose-600">Tasarlayıcı</span>
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-12 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-rose-600" : "bg-zinc-800"}`}></div>
          ))}
        </div>
      </div>

      <div className="min-h-[120px] flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-4 text-rose-600 font-black italic tracking-widest uppercase text-xs mb-2">
              <MapPin className="w-4 h-4" /> 01. COĞRAFİ DOĞRULAMA
            </div>
            <p className="text-zinc-400 text-xl font-medium lowercase first-letter:uppercase italic border-l-4 border-rose-600 pl-8">
              {neighborhood} / {district} hattındaki Elit Protocol HUB erişimi onaylandı.
              <span className="text-white block mt-2">Bölgesel veri paketleri ve elite katalog eşleşmesi hazırlanıyor...</span>
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-4 text-rose-600 font-black italic tracking-widest uppercase text-xs mb-2">
              <UserCheck className="w-4 h-4" /> 02. DENEYİM TASARIMI
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 text-left hover:border-rose-600 transition-colors group/btn">
                <span className="text-white font-black italic text-sm block mb-1">ELITE PROTOKOL</span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest group-hover/btn:text-rose-600">LAYER 01 // SECURE</span>
              </button>
              <button className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 text-left hover:border-rose-600 transition-colors group/btn">
                <span className="text-white font-black italic text-sm block mb-1">VIP CONCIERGE</span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest group-hover/btn:text-rose-600">LAYER 02 // PRIVATE</span>
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-4 text-rose-600 font-black italic tracking-widest uppercase text-xs mb-2">
              <ShieldCheck className="w-4 h-4" /> 03. ŞİFRELİ EL SIKIŞMA (E2E)
            </div>
            <p className="text-zinc-400 text-xl font-medium italic border-l-4 border-rose-600 pl-8">
              Bağlantı Elit Protocol standartlarında izole edildi.
              <span className="text-white block mt-2 italic uppercase font-black text-2xl tracking-[0.2em]">HANDSHAKE: [SVR-EX-24]</span>
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={loading}
        className="mt-16 w-full bg-rose-600 py-8 rounded-4xl text-black font-extrabold italic text-2xl uppercase tracking-tighter hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_30px_90px_rgba(225,29,72,0.4)] flex justify-center items-center gap-4 group/submit"
      >
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <>
            {step === 3 ? "GÜVENLİ BAĞLANTIYI KUR" : "PROSESİ DEVAM ET"}
            <span className="bg-black/10 px-4 py-1 rounded-full text-[10px] tracking-[0.3em] font-black italic group-hover/submit:bg-black/20">STEP 0{step}</span>
          </>
        )}
      </button>

      <div className="mt-8 text-center text-[9px] font-black italic text-zinc-700 tracking-widest uppercase">
        SECURE PROTOCOL BY istanbulescort.blog // EST. 2026
      </div>
    </div>
  );
}
