"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWhatsAppStatus } from "./actions";

export default function WhatsAppCommandCenter() {
  const [needsScan, setNeedsScan] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await getWhatsAppStatus();
      setNeedsScan(status.needsScan);
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono p-8 selection:bg-red-900 selection:text-white">
      <header className="flex justify-between items-end border-b border-red-900 pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            DRKCNAY <span className="text-white">AI CLOSER</span>
          </h1>
          <p className="text-red-800 text-sm mt-1 uppercase">WhatsApp Autonomous Sales Engine v1.0</p>
        </div>
        <div className="flex gap-4">
          <Link href="/sovereign-hq" className="px-4 py-2 border border-red-900 hover:bg-red-900 hover:text-white transition-colors uppercase text-xs">
            [HQ Dön]
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-12 text-center border border-red-900 bg-black/50 p-12 shadow-[0_0_50px_rgba(220,38,38,0.1)] backdrop-blur-md">
        
        {needsScan === null ? (
          <div className="animate-pulse text-red-500">Durum Sorgulanıyor...</div>
        ) : needsScan ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-block border-2 border-red-600 p-4 bg-white shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              {/* Force image reload by appending timestamp */}
              <img src={"/wa-qr.png?t=" + Date.now()} alt="WhatsApp QR" className="w-64 h-64 mx-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white uppercase mb-2">Bağlantı Bekleniyor</h2>
              <p className="text-red-400">Telefonunuzdan WhatsApp ayarlarına girin, Bağlı Cihazlar'ı seçip ekrandaki QR kodu okutun.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="text-8xl mb-4 drop-shadow-[0_0_30px_rgba(0,255,0,0.5)]">✅</div>
            <h2 className="text-3xl font-bold text-green-500 uppercase">Bağlantı Kuruldu</h2>
            <p className="text-green-800/80 max-w-lg mx-auto">DRKCNAY AI Closer şu an aktif olarak WhatsApp hattınızı dinliyor. Gelen tüm mesajlar "Lüks Asistan" karakteriyle OmniAI tarafından otomatik cevaplanacaktır.</p>
          </div>
        )}

      </main>
    </div>
  );
}
