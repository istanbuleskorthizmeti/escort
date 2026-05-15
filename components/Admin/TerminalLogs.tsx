"use client";

import { useEffect, useState } from "react";
import { fetchCronLogs } from "../../app/sovereign-hq/actions";

export default function TerminalLogs() {
  const [logs, setLogs] = useState<string>("INITIALIZING SECURE LOG STREAM...\n");
  const [loading, setLoading] = useState(true);

  // Poll for logs every 10 seconds
  useEffect(() => {
    const fetchIt = async () => {
      const data = await fetchCronLogs();
      setLogs((prev) => prev !== data ? data : prev); // Sadece değiştiğinde re-render at
      setLoading(false);
    };

    fetchIt();
    const interval = setInterval(fetchIt, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-[0_0_30px_-10px_rgba(239,68,68,0.05)]">
      <div className="bg-zinc-950 border-b border-zinc-900 p-3 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <div className="text-[10px] text-zinc-500 tracking-widest uppercase font-mono">
          /var/log/escortvip-cron.log
        </div>
      </div>
      
      <div className="p-4 flex-1 bg-[#050505] overflow-y-auto font-mono text-[11px] leading-relaxed relative">
        <div className="text-green-500/80 break-words whitespace-pre-wrap">
          {loading ? (
            <span className="animate-pulse">Loading system traces...</span>
          ) : (
            logs
          )}
        </div>
        {/* Fakir Tarama (Scanline) efekti */}
        <div className="absolute top-0 left-0 w-full h-[200%] bg-linear-to-b from-transparent via-red-500/5 to-transparent pointer-events-none animate-[scan_6s_linear_infinite]" />
      </div>
    </div>
  );
}
