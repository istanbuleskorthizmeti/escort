"use client";

import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAppStore, type AppState } from "@/lib/store";

export function RankTrackerTable() {
  const rankResults = useAppStore((state: AppState) => state.rankResults);

  if (rankResults.length === 0) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/50 border-b border-white/10 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Sorgu</th>
              <th className="px-6 py-4 font-medium">Konum</th>
              <th className="px-6 py-4 font-medium text-center">Sıra</th>
              <th className="px-6 py-4 font-medium">Tespit Edilen URL / Rakipler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankResults.map((res: any, i: number) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  {res.status === "loading" && <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />}
                  {res.status === "success" && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {res.status === "error" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                  {res.status === "idle" && <div className="w-2 h-2 rounded-full bg-zinc-600" />}
                  {res.keyword}
                </td>
                <td className="px-6 py-4 text-zinc-400">{res.locationContext || "-"}</td>
                <td className="px-6 py-4 text-center">
                  {res.status === "success" ? (
                    <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-bold ${
                      res.rank === 1 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      typeof res.rank === 'number' && res.rank <= 3 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      typeof res.rank === 'number' && res.rank <= 10 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                      "bg-zinc-800 text-zinc-500"
                    }`}>
                      {res.rank}
                    </span>
                  ) : res.status === "loading" ? "..." : "-"}
                </td>
                <td className="px-6 py-4">
                  {res.status === "success" ? (
                    <div className="space-y-1">
                      {res.url ? (
                        <p className="text-xs text-amber-500/80 truncate max-w-[300px]">{decodeURI(res.url)}</p>
                      ) : (
                        <p className="text-xs text-rose-500/80">İlk 100'de bulunamadı.</p>
                      )}
                      <div className="flex gap-2 text-[10px] text-zinc-500">
                        <span>Rakipler:</span>
                        {res.topCompetitors.map((comp, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-black rounded border border-white/5">{comp}</span>
                        ))}
                      </div>
                    </div>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
