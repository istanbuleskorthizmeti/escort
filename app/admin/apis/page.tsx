"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Server, Zap, RefreshCw, Send, ShieldAlert, BarChart, Database, PauseCircle, PlayCircle, Settings2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ApiCommandCenter() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
    const interval = setInterval(fetchIntegrations, 5000); // 5s refresh for real-time feel
    return () => clearInterval(interval);
  }, []);

  async function fetchIntegrations() {
    try {
      const res = await fetch("/api/admin/integrations");
      const json = await res.json();
      if (json.success) setIntegrations(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: string, payload?: any) {
    setActioning(`${id}-${action}`);
    try {
      await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, payload })
      });
      await fetchIntegrations();
    } catch (e) {
      alert("İşlem başarısız oldu.");
    } finally {
      setActioning(null);
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full"><RefreshCw className="w-8 h-8 text-rose-600 animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">GOD MODE</span> AĞI
          </h1>
          <p className="text-zinc-500 font-bold tracking-widest uppercase italic flex items-center gap-2">
            <Server className="w-4 h-4 text-rose-600" /> Circuit Breaker & Bağımsız API Orkestrasyonu
          </p>
        </div>
      </section>

      {/* INTEGRATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {integrations.map((api: any) => {
            const isError = api.status === 'ERROR' || api.status === 'RATE_LIMITED';
            const isDisabled = api.status === 'DISABLED';
            const isDanger = (api.currentUsage / api.dailyLimit) > 0.9;
            
            let statusColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
            let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            
            if (isError) {
              statusColor = "bg-rose-500/10 text-rose-500 border-rose-500/50 animate-pulse";
              icon = <ShieldAlert className="w-5 h-5 text-rose-500" />;
            } else if (isDisabled) {
              statusColor = "bg-zinc-800/50 text-zinc-500 border-zinc-800";
              icon = <PauseCircle className="w-5 h-5 text-zinc-500" />;
            } else if (isDanger) {
              statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/50";
              icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
            }

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                key={api.id} 
                className={`bg-[#0a0a0a] border ${isError ? 'border-rose-900/50 shadow-[0_0_30px_rgba(225,29,72,0.1)]' : 'border-zinc-900'} rounded-[2rem] overflow-hidden flex flex-col`}
              >
                {/* Header */}
                <div className={`p-5 flex justify-between items-start border-b border-zinc-900/50 ${isDisabled ? 'opacity-50' : ''}`}>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{api.id}</span>
                    <h3 className="text-xl font-black italic text-white tracking-tight">{api.name}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                    {icon}
                    {api.status}
                  </div>
                </div>

                {/* Body */}
                <div className={`p-5 space-y-5 flex-1 ${isDisabled ? 'opacity-50 grayscale' : ''}`}>
                  {/* Quota */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Günlük Kota</span>
                      <div className="text-right">
                        <span className={`text-2xl font-black italic ${isError ? 'text-rose-500' : 'text-white'}`}>
                          {api.currentUsage.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-zinc-600 ml-1">/ {api.dailyLimit.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isError ? 'bg-rose-500' : isDanger ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(100, (api.currentUsage / api.dailyLimit) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {isError && api.errorMessage && (
                    <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-xl">
                      <p className="text-rose-400 text-xs font-mono">{api.errorMessage}</p>
                    </div>
                  )}
                </div>

                {/* Actions (Footer) */}
                <div className="p-3 bg-zinc-950 flex gap-2 border-t border-zinc-900">
                  <button 
                    onClick={() => handleAction(api.id, 'TOGGLE_STATUS')}
                    disabled={actioning !== null}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    {isDisabled ? <PlayCircle className="w-4 h-4 text-emerald-400" /> : <PauseCircle className="w-4 h-4 text-amber-400" />}
                    {isDisabled ? 'Aktif Et' : 'Durdur'}
                  </button>
                  <button 
                    onClick={() => handleAction(api.id, 'RESET_QUOTA')}
                    disabled={actioning !== null || api.currentUsage === 0}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                    Sıfırla
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
