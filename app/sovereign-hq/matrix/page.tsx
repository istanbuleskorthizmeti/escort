"use client";

import { useState, useEffect } from "react";
import { Globe, Shield, Zap, Search, Server, Activity, ArrowUpRight, Filter } from "lucide-react";
import { fetchDomainMatrix } from "../actions";

export default function DomainMatrixPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDomainMatrix().then(data => {
      setDomains(data);
      setIsLoading(false);
    });
  }, []);

  const filteredDomains = domains.filter(d => {
    const matchesSearch = d.host.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || d.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-4 md:p-8 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Hydra <span className="text-emerald-500">Matrix</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mt-1 font-mono flex items-center gap-2">
              <Server size={10} className="text-emerald-500" /> Endpoint & Routing Control Center
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input 
                  type="text" 
                  placeholder="Search Host..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500 transition-all"
                />
             </div>
             <select 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="bg-zinc-950 border border-zinc-900 rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-emerald-500"
             >
                <option value="ALL">ALL ROLES</option>
                <option value="MONEY_SITE">MONEY SITES</option>
                <option value="SATELLITE">SATELLITES</option>
                <option value="CLOAKER">CLOAKERS</option>
             </select>
          </div>
        </header>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "TOTAL ENDPOINTS", value: domains.length, icon: Globe, color: "text-blue-500" },
            { label: "ACTIVE SATELLITES", value: domains.filter(d => d.role === 'SATELLITE').length, icon: Zap, color: "text-amber-500" },
            { label: "CLOAKER TRAPS", value: domains.filter(d => d.role === 'CLOAKER').length, icon: Shield, color: "text-rose-500" },
            { label: "MONEY SITES", value: domains.filter(d => d.role === 'MONEY_SITE').length, icon: Activity, color: "text-emerald-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
               </div>
               <stat.icon size={24} className="opacity-20" />
            </div>
          ))}
        </div>

        {/* MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
             Array(9).fill(0).map((_, i) => (
               <div key={i} className="h-32 bg-zinc-950/50 border border-zinc-900 rounded-2xl animate-pulse"></div>
             ))
          ) : filteredDomains.map((domain, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 hover:border-emerald-900/50 p-5 rounded-2xl transition-all group relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                    domain.role === 'MONEY_SITE' ? 'bg-emerald-500/10 text-emerald-500' :
                    domain.role === 'CLOAKER' ? 'bg-rose-500/10 text-rose-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {domain.role}
                  </div>
                  <a href={`https://${domain.host}`} target="_blank" className="text-zinc-600 hover:text-white transition-colors">
                    <ArrowUpRight size={16} />
                  </a>
               </div>

               <h3 className="text-lg font-bold text-white truncate mb-1">{domain.host}</h3>
               <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mb-4">
                  <span className="uppercase">{domain.serverGroup}</span>
                  <span>•</span>
                  <span className="uppercase">{domain.theme} THEME</span>
               </div>

               <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase tracking-widest">
                  <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                     <span className="text-zinc-600 block mb-1 uppercase">Target City</span>
                     <span className="text-zinc-300">{domain.targetCity || "GLOBAL"}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                     <span className="text-zinc-600 block mb-1 uppercase">Target District</span>
                     <span className="text-zinc-300">{domain.targetDistrict || "ALL"}</span>
                  </div>
               </div>

               {/* Activity Bar Mock */}
               <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                     <span className="text-[9px] text-emerald-500/80 font-bold uppercase">Uptime 99.9%</span>
                  </div>
                  <span className="text-[9px] text-zinc-700 font-mono">ID: HYDRA-{i+100}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
