import React from 'react';
import { Coffee, MapPin, Edit3, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderBar({ tableNumber, onPromptTable }) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#EFE9E2] text-[#2C221E] px-4 py-3 shadow-xs flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-md shadow-[#C85A32]/30 flex-shrink-0"
        >
          <Coffee className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h1 className="font-brand font-extrabold text-xs tracking-wider uppercase leading-tight text-[#2C221E]">
            Kiri Coffee & Eatery
          </h1>
          <a 
            href="https://www.instagram.com/kiricoffee_/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-[#7E746F] hover:text-[#C85A32] flex items-center gap-1 transition-colors duration-300"
          >
            <Instagram className="w-3 h-3 text-[#C85A32]" /> @kiricoffee_
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Table Number Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onPromptTable}
          className="bg-[#FAF7F2] border border-[#EFE9E2] px-3 py-1.5 rounded-full text-xs font-brand font-bold text-[#2C221E] flex items-center gap-1.5 shadow-xs hover:border-[#C85A32]/40 transition-all"
        >
          <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>Meja</span>
          <motion.span 
            key={tableNumber}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#C85A32] text-white px-2 py-0.5 rounded-full font-mono text-xs font-extrabold"
          >
            {tableNumber}
          </motion.span>
          <Edit3 className="w-3 h-3 text-[#7E746F]" />
        </motion.button>
      </div>
    </motion.header>
  );
}
