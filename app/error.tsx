'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to a Elit-grade monitoring service
    console.error('🛡️ Elit ERROR BOUNDARY:', error);
    if (typeof window !== 'undefined') {
       (window as any).lastError = error;
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center antialiased">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-sm border border-zinc-100">
        <h1 className="text-3xl font-bold text-zinc-800 mb-4">
          Sayfa Yüklenemedi
        </h1>
        
        <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-4">
          Geçici bir teknik sorun nedeniyle bu sayfayı şu anda görüntüleyemiyorsunuz. Lütfen daha sonra tekrar deneyin.
        </p>
        
        {error?.message && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 text-[10px] font-mono break-all rounded-lg border border-red-100">
             ERROR: {error.message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition-all cursor-pointer"
          >
            Tekrar Dene
          </button>
          
          <Link
            href="/"
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-3 rounded-xl transition-all"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
