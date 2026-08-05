import React from 'react';
import { ArrowRight, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const words = ['Savor', 'Every', 'Moment,'];
const words2 = ['Order', 'from', 'Your', 'Table'];

export default function GetStartedScreen({ onGetStarted }) {
  return (
    <div className="relative w-full h-screen min-h-[660px] bg-[#0D0B0A] flex flex-col justify-between overflow-hidden select-none">

      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/kiri-cilegon.jpg"
          alt="Dump Cafe Building Exterior"
          className="w-full h-full object-cover object-center opacity-50 scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {/* Deep cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/70 to-[#0D0B0A]/30" />
      </div>

      {/* Ambient Aurora Orbs */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-[#E8703E]/15 blur-[80px] animate-aurora pointer-events-none" />
      <div className="absolute bottom-1/3 -right-16 w-48 h-48 rounded-full bg-[#D4A574]/10 blur-[60px] animate-aurora pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Top Header Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 p-5 pt-10"
      >
        <div className="glass-panel inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8703E] to-[#C85A32] flex items-center justify-center shadow-lg shadow-[#E8703E]/30 animate-float">
            <Coffee className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-brand font-extrabold text-[11px] text-[#F5F0EB] tracking-[0.2em] uppercase">
              DUMP CAFE
            </h1>
            <p className="text-[9px] text-[#D4A574] font-mono tracking-wide">
              Artisan & Eatery
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Welcome Card */}
      <div className="relative z-10 p-5 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 25 }}
          className="glass-card rounded-[28px] p-6 pb-7 space-y-5"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-1.5 bg-[#E8703E]/15 text-[#FF9E79] border border-[#E8703E]/25 text-[10px] font-brand font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8703E] animate-pulse" />
            <span>Self-Order • Dump Cafe</span>
          </motion.div>

          {/* Kinetic Typography */}
          <div className="space-y-0.5">
            <div className="flex flex-wrap gap-x-2.5">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-[26px] text-[#F5F0EB] leading-tight"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2.5">
              {words2.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.2 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-serif text-[26px] leading-tight ${
                    word === 'Your' || word === 'Table' ? 'text-[#FF9E79] italic' : 'text-[#F5F0EB]'
                  }`}
                >
                  {word === 'Your' || word === 'Table' ? (
                    <span className="underline decoration-[#E8703E]/50 underline-offset-4">{word}</span>
                  ) : word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-xs text-[#9A8E85] font-brand leading-relaxed"
          >
            Nikmati kemudahan pesan kopi espresso, pastry hangat, & eatery lezat langsung dari tempat dudukmu tanpa perlu antre.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, type: "spring", stiffness: 300, damping: 20 }}
            onClick={onGetStarted}
            className="btn-cta w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-brand font-extrabold text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#E8703E]/30 tracking-wider uppercase"
          >
            <span>Mulai Memesan</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
