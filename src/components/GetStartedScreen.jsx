import React from 'react';
import { ArrowRight, Coffee, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const words = ['Savor', 'Every', 'Moment,'];
const words2 = ['Order', 'from', 'Your', 'Table'];

export default function GetStartedScreen({ onGetStarted }) {
  return (
    <div className="relative w-full h-screen min-h-[660px] bg-[#FAF7F2] flex flex-col justify-between overflow-hidden select-none">

      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/kiri-cilegon.jpg"
          alt="Dump Cafe Building Exterior"
          className="w-full h-full object-cover object-center filter brightness-95 scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {/* Soft Vignette Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/90 via-[#2C221E]/40 to-black/20" />
      </div>

      {/* Top Header Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 p-5 pt-8"
      >
        <div className="bg-black/35 backdrop-blur-md border border-white/20 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-md">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center text-white font-brand font-black text-xs shadow-sm">
            D
          </div>
          <div>
            <h1 className="font-brand font-extrabold text-[11px] text-white tracking-[0.2em] uppercase">
              DUMP CAFE
            </h1>
            <p className="text-[9px] text-amber-200 font-mono tracking-wide">
              Artisan & Eatery
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Welcome Card */}
      <div className="relative z-10 p-5 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 24 }}
          className="bg-[#2C221E]/95 backdrop-blur-xl border border-white/15 p-6 rounded-[32px] text-white shadow-2xl space-y-4"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#C85A32]/25 text-[#FF9E79] border border-[#C85A32]/40 text-[10px] font-brand font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SELAMAT DATANG DI DUMP CAFE</span>
          </div>

          {/* Title */}
          <div className="space-y-0.5">
            <div className="flex flex-wrap gap-x-2">
              {words.map((word, i) => (
                <span key={i} className="font-serif text-2xl text-white font-normal leading-tight">
                  {word}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2">
              {words2.map((word, i) => (
                <span
                  key={i}
                  className={`font-serif text-2xl leading-tight ${
                    word === 'Your' || word === 'Table' ? 'text-[#FF9E79] italic font-normal' : 'text-white font-normal'
                  }`}
                >
                  {word === 'Your' || word === 'Table' ? (
                    <span className="underline decoration-[#C85A32] underline-offset-4">{word}</span>
                  ) : word}
                </span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-white/70 font-brand font-normal leading-relaxed">
            Nikmati kemudahan pesan kopi espresso, pastry hangat, & eatery lezat langsung dari tempat dudukmu tanpa perlu antre.
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="btn-cta w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#C85A32]/40 tracking-wider uppercase"
          >
            <span>Mulai Memesan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
