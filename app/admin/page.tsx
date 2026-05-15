"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Globe, Cpu, Users, BarChart3, ArrowUpRight, 
  Activity, Search, Send, CheckCircle2, AlertTriangle, Clock
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchWorkers();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  }

  async function fetchWorkers() {
    try {
      const res = await fetch("/api/admin/workers/status");
      const data = await res.json();
      if (data.workers) setWorkers(data.workers);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleHardPing() {
    setPinging(true);
    try {
      const res = await fetch("/api/admin/seo/hard-push", { method: "POST", body: JSON.stringify({}) });
      const data = await res.json();
      if (data.success) {
        alert("🚀 Hard-Ping Motoru Tetiklendi! Sonuçlar Telegram'a iletilecek.");
      }
    } catch (e) { alert("Hata oluştu."); }
    setPinging(false);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
            COMMAND <span className="text-rose-600">CENTER</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-widest uppercase italic flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600 animate-pulse" /> DRKCNAY ELITE DOMINATION ENGINE v6.2
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleHardPing}
            disabled={pinging}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black italic uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all flex items-center gap-3"
          >
            {pinging ? <Clock className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            HARD PING BAŞLAT
          </button>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOPLAM TALEP", value: stats?.stats?.totalLeads || "0", icon: Users, trend: "+12%" },
          { label: "GÜNLÜK CİRO", value: `${stats?.stats?.revenue?.toLocaleString() || "0"} TL`, icon: BarChart3, trend: "+8%" },
          { label: "İNDEKSLENEN", value: stats?.stats?.completed || "0", icon: Search, trend: "Otonom" },
          { label: "AKTİF DOMAİN", value: "2", icon: Globe, trend: "Stabil" },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-[2rem] hover:border-rose-600/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-rose-600/10 transition-colors">
                <item.icon className="w-6 h-6 text-zinc-500 group-hover:text-rose-600 transition-colors" />
              </div>
              <span className="text-[10px] font-black text-rose-600 bg-rose-600/10 px-3 py-1 rounded-full uppercase italic">
                {item.trend}
              </span>
            </div>
            <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic mb-1">{item.label}</p>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{item.value}</h3>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* HYDRA WORKERS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black italic uppercase tracking-widest text-zinc-400">HYDRA WORKERS</h2>
            <div className="text-[10px] font-black text-zinc-600 uppercase italic">AKTİF İŞÇİ: {workers.filter(w=>w.status==='online').length}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker, i) => (
              <div key={i} className="bg-zinc-950/50 border border-zinc-900 p-6 rounded-3xl space-y-4 hover:border-zinc-800 transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${worker.status === 'online' ? 'bg-emerald-500 animate-pulse' : worker.status === 'error' ? 'bg-rose-600' : 'bg-zinc-700'}`}></div>
                    <span className="text-sm font-black italic uppercase tracking-tight text-white">{worker.name}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase italic ${worker.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-900 text-zinc-600'}`}>
                    {worker.status}
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase italic">
                  <span>ROOT: {worker.type}</span>
                  <span>SAĞLIK: %{worker.health}</span>
                </div>

                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${worker.health > 80 ? 'bg-emerald-500' : 'bg-rose-600'}`} 
                    style={{ width: `${worker.health}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black italic uppercase tracking-widest text-zinc-400">SİSTEM LOGLARI</h2>
            <button className="text-[10px] font-black text-rose-600 uppercase italic hover:underline">TÜMÜ</button>
          </div>
          
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 h-[400px] overflow-y-auto">
            {stats?.recentActions?.map((log: any, i: number) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-rose-600 rounded-full mt-1.5 shadow-glow-sm"></div>
                  <div className="w-px flex-1 bg-zinc-900 my-1 group-last:hidden"></div>
                </div>
                <div className="space-y-1 pb-6">
                  <p className="text-[10px] font-black text-zinc-600 uppercase italic">{log.time}</p>
                  <p className="text-xs font-bold text-zinc-300 leading-relaxed uppercase italic">
                    <span className="text-rose-600">{log.admin}</span>: {log.action} - <span className="text-white">{log.region}</span>
                  </p>
                </div>
              </div>
            )) || <p className="text-zinc-700 font-bold italic text-center py-20 uppercase tracking-widest">Veri bekleniyor...</p>}
          </div>
        </div>

      </div>

    </div>
  );
}
