import React from 'react';
import { Sparkles, ArrowRight, MapPin, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GetStartedScreen({ onGetStarted }) {
  return (
    <div className="relative w-full h-screen min-h-[660px] bg-[#2C221E] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/kiri-cilegon.jpg"
          alt="Dump Cafe Building Exterior"
          className="w-full h-full object-cover object-center opacity-85 scale-105 filter brightness-95"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/30 to-transparent" />
      </div>

      {/* Top Header Branding */}
      <div className="relative z-10 p-5 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center text-white font-brand font-black text-xs shadow-sm">
            D
          </div>
          <div>
            <h1 className="font-brand font-extrabold text-xs text-white tracking-widest uppercase">
              DUMP CAFE
            </h1>
            <p className="text-[9px] text-amber-200/90 font-mono tracking-tight">
              Artisan & Eatery
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Welcome Card */}
      <div className="relative z-10 p-5 pb-8">
        <div className="bg-[#2C221E]/95 backdrop-blur-xl border border-white/15 p-6 rounded-[32px] text-white shadow-2xl shadow-black/80 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#C85A32]/25 text-[#FF9E79] border border-[#C85A32]/40 text-[10px] font-brand font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SELAMAT DATANG DI DUMP CAFE</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl text-white leading-tight font-normal">
              Savor Every Moment,
            </h2>
            <h2 className="font-serif text-2xl text-[#FF9E79] italic font-normal">
              Order directly from <span className="underline decoration-[#C85A32] underline-offset-4 font-normal">Your Table</span>
            </h2>
          </div>

          <p className="text-xs text-white/70 font-brand font-normal leading-relaxed">
            Nikmati kemudahan pesan kopi espresso, pastry hangat, & eatery lezat langsung dari tempat dudukmu tanpa perlu antre.
          </p>

          {/* Primary Action Button */}
          <button
            onClick={onGetStarted}
            className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#C85A32]/40 tracking-wider uppercase"
          >
            <span>Mulai Memesan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
