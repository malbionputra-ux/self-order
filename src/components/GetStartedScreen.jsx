import React from 'react';
import { ArrowRight, Coffee, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GetStartedScreen({ onGetStarted }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-[#1C1614] text-white flex flex-col justify-between relative overflow-hidden font-brand"
    >
      {/* Kiri Coffee Building Background Photo */}
      <div className="absolute inset-0 bg-[url('/kiri-cilegon.jpg')] bg-cover bg-[position:50%_0%] opacity-90 scale-140 translate-y-14" />
      
      {/* Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614] via-[#1C1614]/20 to-black/50" />

      {/* Animated Ambient Light Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-6 w-44 h-44 bg-[#C85A32]/25 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Header Logo Bar */}
      <div className="relative z-10 p-6 pt-8 flex items-center justify-between">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-md shadow-[#C85A32]/40 border border-white/20">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-brand font-extrabold text-xs tracking-wider uppercase block text-white">
              KIRI COFFEE
            </span>
            <span className="text-[10px] text-white/70 font-mono">Artisan & Eatery</span>
          </div>
        </motion.div>
      </div>

      {/* Middle Spacer to showcase the Kiri Coffee Architecture */}
      <div className="relative z-10 my-auto py-12" />

      {/* Bottom Sheet Welcome Section */}
      <motion.div 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-gradient-to-b from-[#2C221E] via-[#241B18] to-[#1C1614] rounded-t-[36px] p-6 pt-7 border-t border-white/15 shadow-2xl shadow-black flex flex-col gap-5"
      >
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-2" />

        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-amber-400 text-[11px] font-brand font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> SELAMAT DATANG DI KIRI COFFEE
          </span>
          <h1 className="font-serif text-2xl font-bold leading-tight text-white">
            Savor Every Moment, <br />
            Order directly from <span className="text-[#E8703E] italic">Your Table</span>
          </h1>
          <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
            Nikmati kemudahan pesan kopi espresso, pastry hangat, & eatery lezat langsung dari tempat dudukmu tanpa perlu antre.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(200,90,50,0.4)" }}
            whileTap={{ scale: 0.94 }}
            onClick={onGetStarted}
            className="w-full bg-gradient-to-r from-[#C85A32] via-[#E8703E] to-[#C85A32] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#C85A32]/30 text-xs tracking-wider uppercase btn-premium"
          >
            <span>Mulai Memesan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
