import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-r from-[#2C221E] via-[#3D2D27] to-[#2C221E] text-white p-5 border border-white/10 shadow-xl shadow-[#2C221E]/10">
        <div className="relative z-10 space-y-1.5 max-w-[260px]">
          <div className="inline-flex items-center gap-1 bg-[#C85A32]/30 text-amber-200 border border-[#C85A32]/40 text-[10px] font-brand font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" /> WARM SPACE & GOOD MOOD
          </div>
          <h2 className="font-serif text-xl font-normal text-white leading-tight">
            What do you want for <span className="text-[#FF9E79] italic">Coffee & Eatery</span>
          </h2>
          <p className="text-[11px] text-white/70 font-brand leading-normal">
            Pilihan menu artisan coffee, fresh pastry & main course favoritmu.
          </p>
        </div>

        {/* Ambient Light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C85A32]/20 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
