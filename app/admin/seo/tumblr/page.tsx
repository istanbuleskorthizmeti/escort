'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  BarChart3, 
  Send, 
  ShieldCheck, 
  ExternalLink,
  Activity,
  History,
  Tag
} from 'lucide-react';
import { triggerSeoSync } from './actions';

/**
 * DRKCNAY ELITE: SEO DOMINANCE DASHBOARD
 * Premium UI for Autonomous Content Distribution
 */

export default function TumblrSeoDashboard() {
  const [city, setCity] = useState('Ankara');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('Premium VIP');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [{ msg, type }, ...prev].slice(0, 5));
  };

  const handleSync = async () => {
    setIsDeploying(true);
    addLog(`Initiating deployment for ${city}...`, 'info');
    
    try {
      const result = await triggerSeoSync({
        city,
        district,
        category,
        tumblrBlog: 'escortvipturkiye'
      });

      if (result.success && result.data) {
        addLog(`Vault Action: ${result.data.title}`, 'success');
        if (result.data.status === 'queued') {
          addLog(`Background workers have been queued for processing.`, 'success');
        }
      } else {
        addLog(`Sync Failure: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      addLog("System Panic: Trace lost.", "error");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans selection:bg-rose-600/30">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
              DRKCNAY <span className="text-rose-600">Elite</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Autonomous SEO Hydration Pipeline v6.0
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-400">TUNNEL_STABLE</span>
             </div>
          </div>
        </header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Controls - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-black/80 backdrop-blur-3xl border border-zinc-900 p-8 rounded-[4rem] shadow-2xl shadow-rose-900/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <Zap className="text-rose-600 w-6 h-6 fill-rose-600/20" />
              <h2 className="text-2xl font-black uppercase italic">Deployment Hub</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-tighter font-black text-zinc-500 ml-2">Target City</label>
                <input 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-3xl focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-tighter font-black text-zinc-500 ml-2">Category (SEO Niche)</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-3xl focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-xl font-bold"
                >
                  <option>Premium VIP</option>
                  <option>Elite Lifestyle</option>
                  <option>Exclusive Guide</option>
                  <option>Niche Authority</option>
                </select>
              </div>

              <button 
                onClick={handleSync}
                disabled={isDeploying}
                className="w-full relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-rose-900 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-full px-8 py-6 bg-rose-600 rounded-[2.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all text-white font-black uppercase text-xl italic tracking-tighter disabled:opacity-50">
                  {isDeploying ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      DEPLOYING...
                    </div>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      ENGAGE SYNC
                    </>
                  )}
                </div>
              </button>
            </div>
          </motion.div>

          {/* Real-time Status & Metrics */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Monitor 1: Live Logs */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[4rem] p-8 flex flex-col">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="text-zinc-500 w-5 h-5" />
                    <h3 className="font-black uppercase tracking-tighter text-zinc-400">System Pulse</h3>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Live Updates</div>
               </div>
               
               <div className="flex-1 space-y-4 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-4 rounded-2xl border ${
                          log.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          log.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                          'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                        } text-sm font-bold flex items-center justify-between`}
                      >
                        {log.msg}
                        {log.type === 'success' && <ShieldCheck className="w-4 h-4" />}
                      </motion.div>
                    ))}
                    {logs.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-800 space-y-4">
                        <History className="w-12 h-12" />
                        <span className="text-xs uppercase font-black">Waiting for commands</span>
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Monitor 2: Global Stats */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-900 p-8 rounded-[3rem]">
                 <div className="flex items-center gap-3 mb-4">
                    <Globe className="text-rose-600 w-5 h-5" />
                    <span className="text-xs font-black uppercase text-zinc-500">Domain Authority</span>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-6xl font-black italic tracking-tighter">78<span className="text-rose-600">.4</span></span>
                    <span className="text-xs font-bold text-green-500 mb-2 uppercase">+2.1% PW</span>
                 </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem]">
                 <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="text-blue-500 w-5 h-5" />
                    <span className="text-xs font-black uppercase text-zinc-500">Total Traffic (Shortlinks)</span>
                 </div>
                 <div className="text-5xl font-black italic tracking-tighter text-zinc-100">
                    124,592 <span className="text-zinc-700 text-2xl uppercase font-bold tracking-tighter not-italic">CLKS</span>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Protocol Footer */}
        <footer className="pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
          <div>istanbulescort.blog — Digital Dominance Division</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-rose-600 transition-colors">Endpoint Status</a>
            <a href="#" className="hover:text-rose-600 transition-colors">Tag Protocol</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
