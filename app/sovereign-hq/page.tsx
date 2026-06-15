"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TerminalLogs from "../../components/Admin/TerminalLogs";
import SEOAnalytics from "../../components/Admin/SEOAnalytics";
import { fetchTelemetry, revokeClearance, fetchQueueStatus, triggerSiegeMode } from "./actions";

interface Telemetry {
  status: string;
  cpu: string;
  mem: string;
  uptime: string;
}

interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  isOnline: boolean;
}

export default function CommandHQ() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [siegeCity, setSiegeCity] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchTelemetry().then(setTelemetry);
    fetchQueueStatus().then(setQueueStatus);
    // Poll every 5 sec
    const i = setInterval(() => {
      fetchTelemetry().then(setTelemetry);
      fetchQueueStatus().then(setQueueStatus);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  const handleSiege = async () => {
    if (!siegeCity) return alert('Lütfen hedef şehir girin!');
    setIsDeploying(true);
    const result = await triggerSiegeMode(siegeCity);
    if (result.success) {
      setSiegeCity('');
      fetchQueueStatus().then(setQueueStatus);
    } else {
      alert(`Siege Failed: ${result.error}`);
    }
    setIsDeploying(false);
  };
  const handleLogout = async () => {
    await revokeClearance();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-red-900 selection:text-white p-4 md:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
      <div className="fixed top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-900/50 to-transparent z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8 h-[calc(100vh-4rem)]">
        {/* HEADER */}
        <header className="flex justify-between items-end border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Elit Command
            </h1>
            <div className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-mono mt-1">
              VIP / Tam Gizlilik Telemetry
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] border border-red-900/30 hover:border-red-500 text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest px-4 py-2 font-black"
          >
            DISCONNECT
          </button>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "NODE STATUS", value: telemetry?.status || "...", glow: telemetry?.status === "ONLINE" || telemetry?.status === "MOCK_LIVE" ? "text-green-400" : "text-yellow-500" },
            { label: "CPU STRESS", value: telemetry?.cpu || "...", glow: "text-red-400" },
            { label: "MEMORY", value: telemetry?.mem || "...", glow: "text-zinc-100" },
            { label: "UPTIME", value: telemetry?.uptime || "...", glow: "text-blue-400" }
          ].map((m, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex flex-col">
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-mono">{m.label}</span>
              <span className={`text-2xl font-black tracking-tighter ${m.glow}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* MAIN COCKPIT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
          <div className="col-span-1 flex flex-col gap-6">
            <SEOAnalytics />
            
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex-1">
               <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">Battle Control</h3>
               <div className="space-y-3">
                  <Link href="/sovereign-hq/matrix" className="w-full bg-black border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-900/10 text-zinc-100 hover:text-emerald-500 transition-all py-4 px-4 text-xs tracking-widest uppercase flex justify-between items-center group shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <span className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      HYDRA MATRIX
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  <Link href="/sovereign-hq/integrations" className="w-full bg-black border border-rose-900/50 hover:border-rose-500 hover:bg-rose-900/10 text-zinc-100 hover:text-rose-500 transition-all py-4 px-4 text-xs tracking-widest uppercase flex justify-between items-center group shadow-[0_0_15px_rgba(225,29,72,0.1)]">
                    <span className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                      INTEGRATION HUB
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  <button 
                    onClick={async () => {
                      const res = await fetch('/api/admin/pivot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'analyze' })
                      });
                      const data = await res.json();
                      if (data.success) alert('Analiz başlatıldı. Lütfen birkaç dakika bekleyin.');
                    }}
                    className="w-full bg-black border border-rose-900 hover:border-rose-500 hover:bg-rose-900/10 text-rose-500 hover:text-rose-400 transition-all py-3 px-4 text-xs tracking-widest uppercase flex justify-between items-center group"
                  >
                    <span>🛡️ Auto-Pivot Analiz</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>

                  <Link href="/sovereign-hq/pivot" className="w-full bg-black border border-zinc-800 hover:border-emerald-900 hover:bg-emerald-900/10 text-zinc-400 hover:text-emerald-500 transition-all py-3 px-4 text-xs tracking-widest uppercase flex justify-between items-center group">
                    <span>🔄 Pivot Yönetimi</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  <Link href="/sovereign-hq/vitrin-manager" className="w-full bg-black border border-purple-900/50 hover:border-purple-500 hover:bg-purple-900/10 text-zinc-100 hover:text-purple-500 transition-all py-4 px-4 text-xs tracking-widest uppercase flex justify-between items-center group shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <span className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      VİTRİN MANAGER (VIP Elite)
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  <Link href="/sovereign-hq/whatsapp" className="w-full bg-black border border-green-900/50 hover:border-green-500 hover:bg-green-900/10 text-zinc-100 hover:text-green-500 transition-all py-4 px-4 text-xs tracking-widest uppercase flex justify-between items-center group shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <span className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      WHATSAPP CONTROLLER
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  {/* SIEGE C2 CONTROLS */}
                  <div className="mt-6 pt-6 border-t border-red-900/30">
                    <h4 className="text-[10px] text-red-500 uppercase tracking-widest mb-3 font-black flex items-center justify-between">
                      <span>VIP Elite: Edge Siege</span>
                      {queueStatus?.isOnline ? (
                        <span className="text-green-500 animate-pulse">● C2 ACTIVE</span>
                      ) : (
                        <span className="text-zinc-600">○ C2 OFFLINE</span>
                      )}
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4 text-center text-[10px] font-mono">
                      <div className="bg-zinc-900 p-2"><span className="block text-zinc-500">WAIT</span>{queueStatus?.waiting || 0}</div>
                      <div className="bg-zinc-900 p-2"><span className="block text-blue-500">ACTV</span>{queueStatus?.active || 0}</div>
                      <div className="bg-zinc-900 p-2"><span className="block text-green-500">DONE</span>{queueStatus?.completed || 0}</div>
                      <div className="bg-zinc-900 p-2"><span className="block text-red-500">FAIL</span>{queueStatus?.failed || 0}</div>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Target City (e.g. nevsehir)" 
                        value={siegeCity}
                        onChange={(e) => setSiegeCity(e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 text-white text-xs p-2 focus:outline-none focus:border-red-500"
                      />
                      <button 
                        onClick={handleSiege}
                        disabled={isDeploying || !queueStatus?.isOnline}
                        className="bg-red-900 hover:bg-red-800 text-white px-4 text-[10px] uppercase font-black tracking-widest disabled:opacity-50 transition-colors"
                      >
                        {isDeploying ? '...' : 'LAUNCH'}
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-black border border-zinc-800 hover:border-red-900 hover:bg-red-900/10 text-zinc-400 hover:text-red-500 transition-all py-3 px-4 text-xs tracking-widest uppercase flex justify-between items-center group">
                    <span>Force SEO Sync</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                  <button className="w-full bg-black border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all py-3 px-4 text-xs tracking-widest uppercase flex justify-between items-center group">
                    <span>Trigger Next Build</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                  <div className="text-[10px] text-zinc-600 italic mt-4 border-l-2 border-red-900 pl-3">
                    Manual override triggers are disabled in MOCK environment.
                  </div>
               </div>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
             <TerminalLogs />
          </div>
        </div>
      </div>
    </div>
  );
}
