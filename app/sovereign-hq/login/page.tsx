"use client";

import { useState } from "react";
import { authenticateProtocol } from "../actions";

export default function ElitAuthGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Server action trigger
    const res = await authenticateProtocol(password);
    
    if (res.success) {
      window.location.href = "/Elit-hq";
    } else {
      setError(res.error || "UNKNOWN SECURITY EXCEPTION");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-6 selection:bg-red-900 selection:text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-zinc-500 text-xs tracking-[0.3em] uppercase">
          United Protocol Network
        </div>
        
        <div className="border border-red-900/50 bg-black/50 p-8 relative overflow-hidden">
          {/* Tarama çizgisi efekti */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/20 shadow-[0_0_20px_2px_rgba(239,68,68,0.5)] animate-scan"></div>
          
          <h1 className="text-3xl font-black mb-2 tracking-tighter decoration-double decoration-red-500/30 underline uppercase italic">
            Prestij Core
          </h1>
          <p className="text-red-500/60 text-xs mb-8">AUTHENTICATION REQUIRED FOR TELEMETRY CONTROL.</p>

          <form onSubmit={handleAuth} className="flex flex-col gap-6">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Master Code</label>
              <div className="flex border-b border-zinc-800 focus-within:border-red-500 transition-colors pb-2">
                <span className="text-zinc-500 mr-3">$&gt;</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full outline-none text-red-500 tracking-widest focus:ring-0 placeholder:text-zinc-800"
                  placeholder="******"
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="text-xs bg-red-950/40 text-red-400 p-3 border border-red-900/50 flex gap-2 items-center">
                <span className="animate-pulse">⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 transition-all duration-300 py-3 text-xs tracking-[0.2em] uppercase font-bold text-zinc-400 hover:text-red-500 disabled:opacity-50"
            >
              {loading ? "Decrypting..." : "Initiate Breach"}
            </button>
          </form>
        </div>
        
        <div className="mt-8 flex justify-between text-[8px] text-zinc-700 uppercase tracking-widest">
          <span>IP: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.X.X </span>
          <span>SECURE CHANNEL</span>
        </div>
      </div>
    </div>
  );
}
