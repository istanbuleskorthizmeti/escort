'use client';

// global-error.tsx is a special error boundary for the top-level layout.
// It MUST define <html> and <body> tags.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr" className="h-full bg-black antialiased">
      <body className="font-sans h-full flex flex-col bg-black text-rose-600 antialiased overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-10 flex-col text-center">
            <h1 className="text-9xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-[0_0_20px_rgba(225,29,72,0.5)]">
               SİSTEM KRİTİK
            </h1>
            
            <p className="text-zinc-400 text-2xl font-bold mb-12 max-w-2xl tracking-[0.05em] leading-normal italic uppercase">
               Çekirdek standartlerde bir aksama tespit edildi. Tüm veriler güvenli bir şekilde dondurulmuştur. Sistemin kendisini onarması için aşağıdaki butona basın.
            </p>

            <button
              onClick={() => reset()}
              className="px-16 py-8 bg-rose-600 text-white font-black italic tracking-[0.2em] uppercase rounded-full hover:bg-rose-500 transition-all shadow-[0_0_80px_rgba(225,29,72,0.4)] cursor-pointer"
            >
              Elit RECOVERY: ONARIMA BAŞLA
            </button>
            
            <div className="mt-20 flex flex-col items-center gap-4 border-l-4 border-rose-600 pl-8">
               <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic">
                  Critical Error ID: {error.digest || 'ROOT_FALLBACK_ACTIVE'}
               </span>
               <span className="text-[10px] font-black tracking-widest text-rose-800 uppercase italic">
                  EscortVIP Prestij Guard Protocol v16.2
               </span>
            </div>
        </div>
      </body>
    </html>
  );
}
