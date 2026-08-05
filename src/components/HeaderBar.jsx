import React from 'react';
import { Coffee, MapPin, Edit3, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderBar({ tableNumber, onPromptTable }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#EFE9E2] text-[#2C221E] px-4 py-3 shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-md shadow-[#C85A32]/25">
          <Coffee className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="font-brand font-extrabold text-xs tracking-wider uppercase leading-tight text-[#2C221E]">
            Dump Cafe & Eatery
          </h1>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#7E746F] hover:text-[#C85A32] flex items-center gap-1 transition-colors duration-300"
          >
            <Instagram className="w-3 h-3 text-[#C85A32]" /> @dumpcafe_
          </a>
        </div>
      </div>

      <button
        onClick={onPromptTable}
        className="btn-fast bg-[#FAF7F2] border border-[#EFE9E2] px-3 py-1.5 rounded-full text-xs font-brand font-bold text-[#2C221E] flex items-center gap-1.5 shadow-xs hover:border-[#C85A32]/40 transition-all"
      >
        <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
        <span>Meja</span>
        <motion.span
          key={tableNumber}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="bg-[#C85A32] text-white px-2 py-0.5 rounded-full font-mono text-xs font-extrabold shadow-xs"
        >
          {tableNumber}
        </motion.span>
        <Edit3 className="w-3 h-3 text-[#7E746F]" />
      </button>
    </header>
  );
}
