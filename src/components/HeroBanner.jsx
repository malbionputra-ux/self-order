import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-r from-[#1C1917] via-[#2C221E] to-[#1C1917] text-white p-5 border-none shadow-xl shadow-[#1C1917]/15">
        <div className="relative z-10 space-y-1.5 max-w-[270px]">
          <div className="inline-flex items-center gap-1 bg-[#C85A32]/30 text-amber-200 border-none text-[10px] font-brand font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" /> WARM SPACE & GOOD MOOD
          </div>
          <h2 className="font-display font-extrabold text-xl text-white leading-tight">
            What do you want for <span className="text-[#FF9E79] italic font-normal">Coffee & Eatery</span>
          </h2>
          <p className="text-[11px] text-white/70 font-brand leading-normal font-medium">
            Pilihan menu artisan coffee, fresh pastry & main course favoritmu.
          </p>
        </div>

        {/* Ambient Light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C85A32]/25 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
