import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <div className="p-4 pt-5 pb-1 bg-[#FAF7F2]">
      {/* Pinterest Title Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-3"
      >
        <span className="inline-flex items-center gap-1.5 bg-[#C85A32]/10 text-[#C85A32] text-[10px] font-brand font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
          <Sparkles className="w-3 h-3 text-[#C85A32]" /> WARM SPACE & GOOD MOOD
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#2C221E] leading-tight">
          What do you want for <span className="text-[#C85A32] italic font-serif">Coffee & Eatery</span>
        </h2>
      </motion.div>
    </div>
  );
}
