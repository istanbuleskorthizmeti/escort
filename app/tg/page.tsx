
import { Shield, MessageCircle, Send, Globe, Award, Zap } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function TelegramLinkHub() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-rose-600/10 blur-[200px] rounded-full z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-900/10 blur-[150px] rounded-full z-0"></div>

      <main className="relative z-10 max-w-md mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
        {/* Profile Section */}
        <div className="mb-12 relative">
          <div className="w-28 h-28 rounded-full border-2 border-rose-600 p-1 bg-zinc-950 shadow-glow">
            <div className="w-full h-full rounded-full bg-linear-to-br from-zinc-900 to-black flex items-center justify-center overflow-hidden">
               <Shield className="w-12 h-12 text-rose-600 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-1.5 rounded-full border-4 border-[#020202]">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
          DRKCNAY <span className="text-rose-600">VIP</span> HQ
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-12 italic border-b border-rose-600/20 pb-4">
          Uncompromised Access Protocol
        </p>

        {/* Buttons Grid */}
        <div className="w-full space-y-4">
          <Link 
            href="https://t.me/escortvip_net" 
            className="group flex items-center justify-between bg-zinc-950/80 border border-zinc-900 p-5 rounded-4xl hover:border-rose-600 hover:bg-rose-600/5 transition-all duration-500 backdrop-blur-3xl"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black uppercase italic tracking-wider">Resmi Telegram Kanallı</div>
                <div className="text-[10px] text-zinc-500 font-bold">Güncel ve Doğrulanmış Profiller</div>
              </div>
            </div>
            < Zap className="w-5 h-5 text-zinc-800 group-hover:text-rose-600 transition-colors" />
          </Link>

          <Link 
            href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} 
            className="group flex items-center justify-between bg-zinc-950/80 border border-zinc-900 p-5 rounded-4xl hover:border-green-600 hover:bg-green-600/5 transition-all duration-500 backdrop-blur-3xl"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black uppercase italic tracking-wider">WhatsApp Concierge</div>
                <div className="text-[10px] text-zinc-500 font-bold">Anlık Rezervasyon & Destek</div>
              </div>
            </div>
            <Zap className="w-5 h-5 text-zinc-800 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link 
            href="/" 
            className="group flex items-center justify-between bg-zinc-950/80 border border-zinc-900 p-5 rounded-4xl hover:border-white hover:bg-white/5 transition-all duration-500 backdrop-blur-3xl"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black uppercase italic tracking-wider">Web Platform</div>
                <div className="text-[10px] text-zinc-500 font-bold">Tüm Lokasyonları Keşfet</div>
              </div>
            </div>
            <Zap className="w-5 h-5 text-zinc-800 group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-24 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">
          SECURE CONNECTION VERIFIED BY<br/>
          <span className="text-rose-800">DRKCNAY PROTOCOL v3.0</span>
        </div>
      </main>
    </div>
  );
}
