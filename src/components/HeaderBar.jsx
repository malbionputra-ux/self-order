import React from 'react';
import { Coffee, MapPin, Edit3, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderBar({ tableNumber, onPromptTable }) {
  return (
    <header className="sticky top-0 z-30 glass-panel px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8703E] to-[#C85A32] flex items-center justify-center shadow-lg shadow-[#E8703E]/20 animate-float" style={{ animationDuration: '5s' }}>
          <Coffee className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="font-brand font-extrabold text-[11px] tracking-[0.15em] uppercase text-[#F5F0EB]">
            Dump Cafe & Eatery
          </h1>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#9A8E85] hover:text-[#E8703E] flex items-center gap-1 transition-colors duration-300"
          >
            <Instagram className="w-3 h-3 text-[#E8703E]/70" /> @dumpcafe_
          </a>
        </div>
      </div>

      <button
        onClick={onPromptTable}
        className="btn-fast glass-panel px-3 py-1.5 rounded-full text-xs font-brand font-bold text-[#F5F0EB] flex items-center gap-1.5 hover:border-[#E8703E]/30 transition-all"
      >
        <MapPin className="w-3.5 h-3.5 text-[#E8703E]" />
        <span className="text-[#9A8E85]">Meja</span>
        <motion.span
          key={tableNumber}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="bg-[#E8703E] text-white px-2 py-0.5 rounded-full font-mono text-[11px] font-extrabold shadow-sm shadow-[#E8703E]/30"
        >
          {tableNumber}
        </motion.span>
        <Edit3 className="w-3 h-3 text-[#6B5F56]" />
      </button>
    </header>
  );
}
