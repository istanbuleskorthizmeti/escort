"use client";

import { useEffect, useState } from "react";
import { fetchSEOStats } from "../../app/sovereign-hq/actions";

export default function SEOAnalytics() {
  const [stats, setStats] = useState({ indexedURLs: 0, status: "FETCHING" });

  useEffect(() => {
    fetchSEOStats().then(setStats);
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden group hover:border-red-900/40 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-red-600/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-zinc-100 text-sm font-bold uppercase tracking-widest mb-1">Elit SEO MESH</h3>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Target: 14 Cities / 45 Districts</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border uppercase ${
          stats.status === "OPTIMIZED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
          stats.status === "STG_MOCK" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
          "bg-zinc-800 text-zinc-400 border-zinc-700 animate-pulse"
        }`}>
          {stats.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black border border-zinc-900 rounded-lg p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
            Active Sitemaps
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">
            {stats.indexedURLs}
          </div>
        </div>

        <div className="bg-black border border-zinc-900 rounded-lg p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
            Kuantum Density
          </div>
          <div className="text-4xl font-black text-zinc-400 tracking-tighter">
            High
          </div>
        </div>
      </div>
    </div>
  );
}
