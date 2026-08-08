import React from 'react';
import { Coffee, MapPin, Edit3, Instagram, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderBar({ tableNumber, onPromptTable, onOpenTableMap }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-none text-[#1C1917] px-4 py-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-md shadow-[#C85A32]/25">
          <Coffee className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-xs tracking-wider uppercase leading-tight text-[#1C1917]">
            Dump Cafe & Eatery
          </h1>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#78716C] hover:text-[#C85A32] flex items-center gap-1 transition-colors duration-300 font-medium"
          >
            <Instagram className="w-3 h-3 text-[#C85A32]" /> @dumpcafe_
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Table Map View Button */}
        <button
          onClick={onOpenTableMap}
          title="Buka Peta Meja (Table Management)"
          className="btn-fast bg-[#FAF7F2] border-none p-2 rounded-full text-xs font-brand font-extrabold text-[#C85A32] flex items-center justify-center shadow-sm hover:bg-[#F5F0EB] transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Current Table Pill Button */}
        <button
          onClick={onPromptTable}
          className="btn-fast bg-[#FAF7F2] border-none px-3 py-1.5 rounded-full text-xs font-brand font-extrabold text-[#1C1917] flex items-center gap-1.5 shadow-sm hover:bg-[#F5F0EB] transition-all"
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
          <Edit3 className="w-3 h-3 text-[#78716C]" />
        </button>
      </div>
    </header>
  );
}
