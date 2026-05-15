"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  item: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-16 flex flex-wrap items-center gap-4 text-[10px] font-black tracking-[0.3em] text-zinc-500 italic uppercase bg-zinc-950/40 backdrop-blur-3xl px-8 py-4 rounded-full border border-zinc-900/50 w-fit group hover:border-rose-600/30 transition-all duration-700 shadow-xl">
      <Link href="/" className="hover:text-rose-600 transition-colors flex items-center gap-3 group/home">
        <Home className="w-3.5 h-3.5 group-hover/home:animate-glow-pulse" />
        <span className="opacity-60 group-hover/home:opacity-100">HOME HUB</span>
      </Link>
      
      {items.map((b, i) => (
        <div key={i} className="flex items-center gap-4">
          <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
          <Link 
            href={b.item} 
            className={`hover:text-white transition-all ${i === items.length - 1 ? 'text-rose-600' : 'opacity-60 hover:opacity-100'}`}
            aria-current={i === items.length - 1 ? 'page' : undefined}
          >
            {b.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
