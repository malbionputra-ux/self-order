import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#1A1614] via-[#231E1B] to-[#1A1614] text-white p-5 border border-white/[0.06] shadow-xl">
        {/* Aurora Ambient Orb */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8703E]/12 rounded-full blur-[50px] animate-aurora pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-28 h-28 bg-[#D4A574]/8 rounded-full blur-[40px] animate-aurora pointer-events-none" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 space-y-2 max-w-[280px]">
          <div className="inline-flex items-center gap-1.5 bg-[#E8703E]/12 text-[#D4A574] border border-[#E8703E]/20 text-[10px] font-brand font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#E8703E]" /> Warm Space & Good Mood
          </div>
          <h2 className="font-serif text-xl leading-tight">
            <span className="text-[#F5F0EB]">What do you want for </span>
            <span className="text-[#FF9E79] italic">Coffee & Eatery</span>
          </h2>
          <p className="text-[11px] text-[#9A8E85] font-brand leading-normal">
            Pilihan menu artisan coffee, fresh pastry & main course favoritmu.
          </p>
        </div>
      </div>
    </div>
  );
}
