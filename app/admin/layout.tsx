"use client";

import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Globe, Zap, LogOut, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-600">
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 blur-[150px]"></div>
      </div>

      {/* TOP COMMAND BAR */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-600/20 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-black italic tracking-widest uppercase">DRKCNAY <span className="text-rose-600">HQ</span></span>
                <p className="text-[8px] font-black tracking-[0.3em] text-zinc-600 uppercase italic">Command Center v6.2</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
              <Link href="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/admin' ? 'bg-zinc-900 text-rose-600 shadow-inner' : 'text-zinc-600 hover:text-white'}`}>
                <LayoutDashboard className="w-3 h-3" /> DASHBOARD
              </Link>
              <Link href="/admin/seo" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pathname.startsWith('/admin/seo') ? 'bg-zinc-900 text-rose-600 shadow-inner' : 'text-zinc-600 hover:text-white'}`}>
                <Globe className="w-3 h-3" /> SEO ENGINE
              </Link>
              <Link href="/admin/apis" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pathname.startsWith('/admin/apis') ? 'bg-zinc-900 text-rose-600 shadow-inner' : 'text-zinc-600 hover:text-white'}`}>
                <Activity className="w-3 h-3" /> API KONTROL
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* LIVE STATUS */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-zinc-950 rounded-full border border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-glow-sm"></div>
                <span className="text-[8px] font-black tracking-widest text-zinc-500 uppercase">SYSTEM: ONLINE</span>
              </div>
              <div className="w-px h-3 bg-zinc-800"></div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-rose-600" />
                <span className="text-[8px] font-black tracking-widest text-zinc-500 uppercase">HYDRA: ACTIVE</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-3 bg-zinc-950 hover:bg-rose-950/30 text-zinc-600 hover:text-rose-600 rounded-xl border border-zinc-900 hover:border-rose-900/50 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {children}
      </main>

      <footer className="py-12 border-t border-zinc-900/50 mt-auto text-center opacity-20">
        <p className="text-[8px] font-black tracking-[0.5em] text-zinc-600 uppercase italic">
          DRKCNAY ELITE INFRASTRUCTURE // SECURED BY TELEGRAM OTP
        </p>
      </footer>
    </div>
  );
}
